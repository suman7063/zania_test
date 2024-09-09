import React, { useRef, useState, useEffect, FC } from 'react';
import { useDrag, useDrop, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import './card.css'
export const ItemTypes = {
  CARD: 'card',
};

interface CardProps {
  id: any;
  text: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const loaderStyle = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderRadius: '50%',
  borderTop: '5px solid #3498db',
  animation: 'spin 1s linear infinite',
};

const overlayStyle = {
  position: 'fixed' as 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search?limit=1';
interface DragItem {
  index: number;
}

export const Card: FC<CardProps> = ({ id, text, index, moveCard }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(CAT_API_URL);
        const data = await response.json();
        setImageUrl(data[0]?.url || '');
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOverlayVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect: (monitor: DropTargetMonitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (clientOffset === null) {
        return;
      }
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id, index }),
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleImageClick = () => {
    setOverlayVisible(true);
  };

  const handleOverlayClick = () => {
    setOverlayVisible(false);
  };

  return (
    <>
      {overlayVisible && (
        <div style={overlayStyle} onClick={handleOverlayClick}>
          <img src={imageUrl} alt="Full Size Cat" className='overlay-img' />
        </div>
      )}
      <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId as string}>
        {loading ? (
          <div className='loader-container'>
            <div style={loaderStyle} />
          </div>
        ) : (
          imageUrl && <img src={imageUrl} alt="Random Cat" className='card-img' onClick={handleImageClick} />
        )}
        <p>{text}</p>
      </div>
    </>
  );
};
