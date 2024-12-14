import React, { useState } from 'react';
import axios from 'axios';
import './UploadDocument.css';

const UploadDocument = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('');

    const handleUpload = async () => {
        if (!file) {
            setStatus('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setStatus('Uploading...');
            await axios.post('http://localhost:5000/upload', formData);
            setStatus('File uploaded successfully.');
        } catch (err) {
            console.error(err);
            setStatus('Upload failed.');
        }
    };

    return (
        <div className="upload-container">
            <div className="upload-box">
                <h3 className="upload-title">Upload a Document</h3>

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="upload-input"
                />

                <button
                    onClick={handleUpload}
                    className="upload-button"
                >
                    Upload
                </button>

                <p className={`upload-status ${status.includes('failed') ? 'status-failed' : 'status-success'}`}>
                    {status}
                </p>
            </div>
        </div>
    );
};

export default UploadDocument;
