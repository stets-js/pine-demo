import React from 'react';
import UploadDocument from './components/UploadDocument/UploadDocument';
import QAInterface from './components/QAInterface/QAInterface';
function App() {
 
  return (
    <div>
            <h1>AI Document QA</h1>
            <UploadDocument />
            <QAInterface />
        </div>
  )
}

export default App
