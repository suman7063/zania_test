import React, { FC, useCallback, useEffect, useState } from 'react';
import update from 'immutability-helper';
import { Card } from './Card';

const style = {
  width: 600,
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
};


const MainPage = () => {
  const [cards, setCards] = useState([]);
  const [newDocument, setNewDocument] = useState({ type: '', title: '', position: cards.length });
  useEffect(() => {
    fetch('/api/documents')
      .then((response) => response.json())
      .then((data) => setCards(data));
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
      .then((data) => setCards([...cards, data]));
  };
  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
    );
  }, []);

  const renderCard = useCallback(
    (card, index) => {
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
    <div style={style}>
         
      {cards.map((card, i) => renderCard(card, i))}
    </div>
    </div>
  )
};

export default MainPage