import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './QAInterface.css';

const QAInterface = () => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatContainerRef = useRef(null);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setChatHistory((prev) => [...prev, { type: 'question', text: question }]);

        try {
            const response = await axios.post('http://localhost:5000/ask', { question });
            const matches = response.data.matches || [];

            matches.forEach((match) => {
                setChatHistory((prev) => [...prev, { type: 'answer', text: match.text }]);
            });
        } catch (err) {
            console.error(err);
            setChatHistory((prev) => [
                ...prev,
                { type: 'error', text: 'Error getting answer.' },
            ]);
        } finally {
            setQuestion('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAsk();
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="container">
            <div ref={chatContainerRef} className="chat-container">
                {chatHistory.map((entry, index) => (
                    <div
                        key={index}
                        className={`message ${
                            entry.type === 'question' ? 'question' : 'answer'
                        }`}
                    >
                        <div
                            className={`text ${
                                entry.type === 'question'
                                    ? 'question-text'
                                    : entry.type === 'answer'
                                    ? 'answer-text'
                                    : 'error-text'
                            }`}
                        >
                            {entry.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="input-section">
                <input
                    type="text"
                    placeholder="Ask a question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown} // Updated to onKeyDown
                    className="input"
                />
                <button onClick={handleAsk} className="button">
                    Ask
                </button>
            </div>
        </div>
    );
};

export default QAInterface;
