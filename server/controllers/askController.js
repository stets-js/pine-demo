const axios = require("axios");
const { getOpenAIEmbedding } = require("../services/openaiService");
const { queryPinecone } = require("../services/pineconeService");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const embedding = await getOpenAIEmbedding(question);

    const queryResponse = await queryPinecone(embedding);

    const matches = queryResponse.matches.map((match) => ({
      text: match.metadata.text,
      score: match.score,
    }));

    res.status(200).json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error answering question.");
  }
};

module.exports = { askQuestion };
