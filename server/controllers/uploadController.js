const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getPineconeVectors } = require("../services/pineconeService");
const { getOpenAIEmbedding } = require("../services/openaiService");

const upload = multer({ storage: multer.memoryStorage() });

const uploadFile = async (req, res) => {
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
        const embedding = await getOpenAIEmbedding(chunk);
        return { chunk, embedding };
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

    await getPineconeVectors(pineconeVectors);

    res.send("File processed and embeddings stored.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing file.");
  }
};

module.exports = { uploadFile };
