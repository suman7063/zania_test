import React, { FC, useCallback, useEffect, useState } from 'react';
import { Card } from './Card';
import  './mainPage.css'
interface Document {
  type: string;
  title: string;
  position: number;
}

const MainPage: FC = () => {
  const [cards, setCards] = useState<Document[]>([]);
  const [newDocument, setNewDocument] = useState<Document>({ type: '', title: '', position: 0 });
  useEffect(() => {
    fetch('/api/documents')
      .then((response) => response.json())
      .then((data: Document[]) => {
        console.log('initial Data', data)
        setCards(data)});
  }, []);
  const addDocument = () => {
    const newPosition = cards.length;
    const updatedDocument = { ...newDocument, position: newPosition };

    fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDocument),
    })
      .then((response) => response.json())
      .then((data: Document) => {
        setCards([...cards, data])});
  };
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      const [draggedCard] = updatedCards.splice(dragIndex, 1);
      updatedCards.splice(hoverIndex, 0, draggedCard);

      fetch('/api/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCards),
      })
        .then((response) => response.json())
        .then((data: Document) => {
          });
  
      return updatedCards;
    });
  }, []);

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
