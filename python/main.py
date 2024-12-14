import openai
import pinecone
import gensim
from gensim import corpora
from nltk.tokenize import word_tokenize
import nltk
import os
import json

nltk.download("punkt")
nltk.download('punkt_tab')
openai.api_key = os.getenv("OPENAI_API_KEY")

pc = pinecone.Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(os.getenv("PINECONE_INDEX"))

def perform_topic_modeling(documents, num_topics=5):
    tokenized_docs = [word_tokenize(doc.lower()) for doc in documents]
    dictionary = corpora.Dictionary(tokenized_docs)
    corpus = [dictionary.doc2bow(doc) for doc in tokenized_docs]
    lda_model = gensim.models.LdaMulticore(corpus, num_topics=num_topics, id2word=dictionary, passes=10)
    topics = lda_model.print_topics(num_words=4)
    return topics, lda_model, corpus, dictionary

def generate_embeddings(text):
    response = openai.embeddings.create(input=text, model="text-embedding-ada-002")
    embeddings = response.data[0].embedding
    return embeddings

def update_pinecone_with_topics(documents, lda_model, corpus, index):
    for doc_id in documents:
        try:
            doc_index = int(doc_id)
            doc = corpus[doc_index]
            topics = lda_model.get_document_topics(doc)
            topics_as_strings = [str(topic[0]) for topic in topics]
            embedding = generate_embeddings(doc)
            vector = {
                'id': doc_id,
                'values': embedding,
                'metadata': {'topics': topics_as_strings}
            }
            index.upsert([vector])
        except ValueError:
            print(f"Skipping invalid doc_id: {doc_id}")

def fetch_documents_from_pinecone(index, limit=10):
    query_vector = [0] * 1536
    query_result = index.query(
        vector=query_vector,
        top_k=limit,
        include_metadata=True
    )
    documents = [item['metadata']['text'] for item in query_result['matches']]
    return documents

def main():
    documents = fetch_documents_from_pinecone(index)
    topics, lda_model, corpus, dictionary = perform_topic_modeling(documents)

    print("Extracted Topics:")
    for topic in topics:
        print(topic)
    
    update_pinecone_with_topics(documents, lda_model, corpus, index)

if __name__ == "__main__":
    main()
