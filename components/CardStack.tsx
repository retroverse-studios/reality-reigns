import React, { useState, useEffect } from 'react';
import { CardData, Reality } from '../types';
import { FALLBACK_IMAGE_DATA_URL } from '../constants';

interface CardProps {
  card: CardData;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  reality: Reality;
}

const Card: React.FC<CardProps> = ({ card, onSwipe, isTop, reality }) => {
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [choiceText, setChoiceText] = useState<string | null>(null);
  const [currentImageSrc, setCurrentImageSrc] = useState(card.imageUrl);

  useEffect(() => {
    setCurrentImageSrc(card.imageUrl);
  }, [card.id, card.imageUrl]);

  const handleImageError = () => {
    setCurrentImageSrc(FALLBACK_IMAGE_DATA_URL);
  };

  const swipeThreshold = 100;

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isTop) return;
    const point = 'touches' in e ? e.touches[0] : e;
    setDragStart({ x: point.clientX, y: point.clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !isTop || !dragStart) return;
    const point = 'touches' in e ? e.touches[0] : e;
    const currentX = point.clientX;
    const deltaX = currentX - dragStart.x;
    
    setDragPos({ x: deltaX, y: 0 });

    if (deltaX > 20) {
      setChoiceText(card.rightChoice.text);
    } else if (deltaX < -20) {
      setChoiceText(card.leftChoice.text);
    } else {
      setChoiceText(null);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);
    
    if (dragPos.x > swipeThreshold) {
      onSwipe('right');
    } else if (dragPos.x < -swipeThreshold) {
      onSwipe('left');
    }
    
    setDragPos({ x: 0, y: 0 });
    setDragStart(null);
    setChoiceText(null);
  };
  
  const rotation = dragPos.x / 20;
  const transform = `translateX(${dragPos.x}px) rotate(${rotation}deg)`;
  const transitionStyle = isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';

  const choiceOpacity = Math.min(Math.abs(dragPos.x) / swipeThreshold, 1);

  return (
    <div
      className={`absolute w-full h-full rounded-2xl shadow-2xl bg-slate-800/80 border-2 ${reality.colors.accent} backdrop-blur-lg flex flex-col overflow-hidden transition-transform duration-300`}
      style={{ 
        transform, 
        transition: transitionStyle,
        cursor: isTop ? (isDragging ? 'grabbing' : 'grab') : 'default',
        touchAction: isTop ? 'none' : 'auto'
       }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="relative w-full h-1/2 bg-black/20">
        {currentImageSrc && (
            <img src={currentImageSrc} onError={handleImageError} alt={card.prompt} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 to-transparent"></div>
        <div className="absolute top-4 left-4 right-4 text-center h-10 flex items-center justify-center">
            <p className={`text-xl font-bold transition-opacity duration-200 text-white text-shadow-md p-2 rounded bg-black/30 ${dragPos.x > 0 ? reality.colors.secondary : reality.colors.primary }`} style={{ opacity: choiceOpacity, textShadow: '1px 1px 2px black' }}>
              {choiceText}
            </p>
        </div>
      </div>
      
      <div className="h-1/2 p-4 md:p-6 flex flex-col justify-between">
        <div className="flex-grow flex items-center justify-center">
            <p className="text-xl md:text-2xl text-center leading-relaxed text-gray-200">{card.prompt}</p>
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-4">
            <span className="text-left w-2/5 font-bold">⇦ {card.leftChoice.text}</span>
            <span className="text-right w-2/5 font-bold">{card.rightChoice.text} ⇨</span>
        </div>
      </div>
    </div>
  );
};

interface CardStackProps {
  cards: CardData[];
  currentIndex: number;
  onSwipe: (card: CardData, direction: 'left' | 'right') => void;
  reality: Reality;
}

const CardStack: React.FC<CardStackProps> = ({ cards, currentIndex, onSwipe, reality }) => {

  const handleSwipe = (direction: 'left' | 'right') => {
    const swipedCard = cards[currentIndex];
    if (swipedCard) {
        onSwipe(swipedCard, direction);
    }
  };

  const cardsToShow = cards.slice(currentIndex, currentIndex + 3).reverse();

  if (cardsToShow.length === 0) {
    return <div className="text-gray-400">Awaiting transmission from the multiverse...</div>;
  }

  return (
    <div className="relative w-11/12 h-[500px] max-w-md md:w-full md:max-w-lg">
      {cardsToShow.map((card, index) => {
        const reversedIndex = cardsToShow.length - 1 - index;
        const isTop = reversedIndex === 0;
        const scale = 1 - reversedIndex * 0.05;
        const translateY = -reversedIndex * 10;
        
        return (
          <div
            key={card.id}
            className="absolute w-full h-full transition-all duration-300 ease-out"
            style={{ 
                transform: `scale(${scale}) translateY(${translateY}px)`,
                zIndex: index
             }}
          >
            <Card
              card={card}
              onSwipe={handleSwipe}
              isTop={isTop}
              reality={reality}
            />
          </div>
        );
      })}
    </div>
  );
};

export default CardStack;