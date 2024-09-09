import React, { FC, useCallback, useEffect, useState } from 'react';
import { Card } from './Card';
import  './mainPage.css'
// Define the type for documents
interface Document {
  type: string;
  title: string;
  position: number;
}

// Define the styles


const MainPage: FC = () => {
  // State for the list of cards and the new document form
  const [cards, setCards] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState<Document>({ type: '', title: '', position: 0 });

  // Fetch the documents from the API on component mount
  useEffect(() => {
    fetch('/api/documents')
      .then((response) => response.json())
      .then((data: Document[]) => setCards(data));
  }, []);

  // Function to handle adding a new document
  const addDocument = () => {
    const newPosition = cards.length;
    const updatedDocument = { ...newDocument, position: newPosition };

    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDocument),
    })
      .then((response) => response.json())
      .then((data: Document) => setCards([...cards, data]));
  };

  // Function to handle moving a card
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) => {
      // Clone the array to avoid mutating state directly
      const updatedCards = [...prevCards];
  
      // Remove the dragged card
      const [draggedCard] = updatedCards.splice(dragIndex, 1);
  
      // Insert the dragged card into the new position
      updatedCards.splice(hoverIndex, 0, draggedCard);
  
      return updatedCards;
    });
  }, []);
  // Render a card with the proper props
  const renderCard = useCallback(
    (card: Document, index: number) => {
      return (
        <Card
          key={card.position}
          index={index}
          id={card.type}
          text={card.title}
          moveCard={moveCard}
        />
      );
    },
    [moveCard]
  );

  return (
    <div>
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
      <div className='card-container'>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </div>
  );
};

export default MainPage;
