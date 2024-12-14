# pine-demo
Demo AI chat with uploading documents (.txt, .pdf)

## Project Setup and Run Instructions

### Prerequisites
- Node.js version 20 or higher is required to run this project.

### Steps to Run the Project

1. **Frontend Setup:**
   - Open a terminal and navigate to the `front` directory:
     ```bash
     cd front
     ```
   - Install the necessary dependencies and start the frontend:
     ```bash
     npm install
     npm run dev
     ```

2. **Backend Setup:**
   - Open a new terminal window and navigate to the `server` directory:
     ```bash
     cd ../server
     ```
   - Install the backend dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file by copying the sample file and configure the necessary keys and settings:
     ```env
     OPENAI_API_KEY=your_openai_api_key
     OPENAI_MODEL=your_openai_model
     PINECONE_API_KEY=your_pinecone_api_key
     PINECONE_ENVIRONMENT="environment"
     PINECONE_INDEX="index_name"
     PORT=your_server_port
     ```

3. **Start the Backend Server:**
   - Run the server:
     ```bash
     node server.js
     ```

---

Ensure all environment variables are correctly configured before starting the server.

### Running the Python Script

This Python script performs basic topic modeling on ingested documents and updates the metadata of those documents in Pinecone with the extracted topics.

#### Steps to Run the Python Script:

1. **Navigate to the `python` directory:**
   ```bash
   cd python

2. **Install the necessary dependencies: Make sure you have all the required Python dependencies installed. You can do this using pip:**
    ```bash
   pip install -r requirements.txt

3. **Set up your environment variables: Create a `.env` file and add the following configuration:**
    ```bash
   OPENAI_API_KEY=your_openai_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX=your_pinecone_index

4. **Run the `main.py` script: After setting up your environment, execute the Python script:**
    ```bash
   python3 main.py
