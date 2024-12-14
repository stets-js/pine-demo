const { Pinecone } = require("@pinecone-database/pinecone");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});
const index = pinecone.index(process.env.PINECONE_INDEX);

const getPineconeVectors = async (pineconeVectors) => {
  if (!Array.isArray(pineconeVectors) || pineconeVectors.length === 0) {
    throw new Error("Pinecone vectors are not properly formatted.");
  }
  return await index.namespace("").upsert(pineconeVectors);
};

const queryPinecone = async (embedding) => {
  return await index.namespace("").query({
    topK: 3,
    vector: embedding,
    includeValues: false,
    includeMetadata: true,
  });
};

module.exports = { getPineconeVectors, queryPinecone };
