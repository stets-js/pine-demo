const axios = require("axios");

const getOpenAIEmbedding = async (input) => {
  const response = await axios.post(
    "https://api.openai.com/v1/embeddings",
    {
      input: input,
      model: process.env.OPENAI_MODEL,
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    }
  );
  return response.data.data[0].embedding;
};

module.exports = { getOpenAIEmbedding };
