const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const { Pinecone } = require("@pinecone-database/pinecone");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors());

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.index(process.env.PINECONE_INDEX);

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).send("No file uploaded.");

    let text = "";
    if (file.mimetype === "application/pdf") {
      const data = await pdfParse({ data: file.buffer });
      text = data.text;
    } else if (file.mimetype === "text/plain") {
      text = file.buffer.toString("utf-8");
    }

    const chunks = text.match(/[^.!?]+(?:[.!?](?=\s|$))?/g) || [];

    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const response = await axios.post(
          "https://api.openai.com/v1/embeddings",
          {
            input: chunk,
            model: process.env.OPENAI_MODEL,
          },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          }
        );

        return { chunk, embedding: response.data.data[0].embedding };
      })
    );

    const pineconeVectors = embeddings.map((e, i) => ({
      id: `${file.originalname}-${i}`,
      values: e.embedding,
      metadata: { text: e.chunk },
    }));

    if (!Array.isArray(pineconeVectors) || pineconeVectors.length === 0) {
      throw new Error("Pinecone vectors are not properly formatted.");
    }

    const result = await index.namespace("").upsert(pineconeVectors);

    res.send("File processed and embeddings stored.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing file.");
  }
});

app.post("/ask", express.json(), async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        input: question,
        model: process.env.OPENAI_MODEL,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );
    const embedding = response.data.data[0].embedding;
    const queryResponse = await index.namespace("").query({
      topK: 3,
      vector: embedding,
      includeValues: false,
      includeMetadata: true,
    });

    const matches = queryResponse.matches.map((match) => ({
      text: match.metadata.text,
      score: match.score,
    }));

    res.status(200).json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error answering question.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
