import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './mainPage.css';

const MainPage = () => {
  const [documents, setDocuments] = useState([]);
  const [newDocument, setNewDocument] = useState({ type: '', title: '', position: documents.length });

  useEffect(() => {
    // Fetch initial data from the mocked API
    fetch('/api/documents')
      .then((response) => response.json())
      .then((data) => setDocuments(data));
  }, []);

  console.log(documents,"documents")
  // Add a new document
  const addDocument = () => {
    const newPosition = documents.length;
    const updatedDocument = { ...newDocument, position: newPosition };

    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDocument),
    })
      .then((response) => response.json())
      .then((data) => setDocuments([...documents, data]));
  };

  // Update documents in the server and local state
  const updateDocuments = (updatedDocs) => {
    fetch('/api/documents', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDocs),
    })
      .then((response) => response.json())
      .then((data) => setDocuments(data));
  };

  const handleStop = (e, data, index) => {
    const updatedDocuments = [...documents];
    const movedDoc = updatedDocuments[index];
  
    // Calculate new position based on the drag event
    const newPosition = Math.max(Math.round(data.x / 100), 0); // Ensure the position is at least 0
  
    // Update the document's position
    movedDoc.position = newPosition;
  
    // Sort documents by the new positions
    updatedDocuments.sort((a, b) => a.position - b.position);
  
    // Update the documents in the state and server
    setDocuments(updatedDocuments);
    updateDocuments(updatedDocuments);
  };
  

  return (
    <div className="main-container">
      <p>Document Management</p>

      {/* Input fields to add a new document */}
      <div className="document-form">
        <input
          type="text"
          value={newDocument.type}
          onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
          placeholder="Type"
        />
        <input
          type="text"
          value={newDocument.title}
          onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
          placeholder="Title"
        />
        <button onClick={addDocument}>Add Document</button>
      </div>

      {/* Container for draggable cards */}
      <div className="document-grid" id="draggable-boundary">
        {documents.map((doc, index) => (
          <Draggable
            key={doc.type} // Make sure each draggable has a unique key
            bounds="parent" // Restrict drag within the parent container
            defaultPosition={{ x: doc.position * 100, y: 0 }} // Position based on the document's position
            onStop={(e, data) => handleStop(e, data, index)} // Handle position update on drag stop
          >
            <div className="card">
              <div className="handle">Drag from here</div>
              <div className="card-content">
                <h3>{doc.title}</h3>
                <p>Type: {doc.type}</p>
              </div>
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
