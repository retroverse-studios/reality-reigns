import React from 'react';
import { Reality, CardData, Deck } from '../types';
import { ExportIcon } from './icons';

interface GameOverScreenProps {
  reason: string;
  reality: Reality;
  onRestart: () => void;
  deck: CardData[];
  addToast: (message: string, type: 'success' | 'error') => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ reason, reality, onRestart, deck, addToast }) => {

  const handleExportDeck = () => {
    if (!deck || deck.length === 0) {
      addToast("No story deck to export.", 'error');
      return;
    }
    const deckToExport: Deck = {
        name: reality.deck?.name || "Exported Story",
        description: reality.deck?.description || `A story played in the ${reality.name} reality.`,
        cards: deck.map(({ prompt, imageUrl, leftChoice, rightChoice }) => ({
            prompt,
            imageUrl,
            leftChoice,
            rightChoice
        }))
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(deckToExport, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `story-${reality.id}-${Date.now()}.json`;
    link.click();
    link.remove();
  }

  return (
    <div className={`flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in ${reality.font}`}>
      <h1 className={`text-7xl font-bold mb-4 ${reality.colors.primary}`}>Game Over</h1>
      <p className="text-2xl text-gray-200 mb-10 max-w-xl">{reason}</p>
      <div className="flex items-center space-x-4">
        <button
          onClick={onRestart}
          className={`py-3 px-8 text-xl font-bold rounded-lg transition-colors duration-300 ${reality.colors.secondary} border-2 ${reality.colors.accent} bg-transparent hover:bg-white/10`}
        >
          Return to the Void
        </button>
        <button
          onClick={handleExportDeck}
          className={`flex items-center gap-2 py-3 px-6 text-xl font-bold rounded-lg transition-colors duration-300 text-gray-300 border-2 border-gray-600 bg-transparent hover:bg-white/10`}
          title="Export the story you just played"
        >
          <ExportIcon />
          Export Story
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;