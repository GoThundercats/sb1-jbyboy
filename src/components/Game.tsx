import React, { useState, useEffect } from 'react';
import Card from './Card';
import RulesModal from './RulesModal';
import RulesReference from './RulesReference';
import {
  initializeDeck,
  shuffleDeck,
  haul,
  performFleaHop,
  isValidDevilHop,
  performDevilHop,
  isValidWalkyTalky,
  performWalkyTalky,
  isValidZonkOut,
  performZonkOut,
  isValidHangout,
  performHangout,
  isValidBargain,
  performBargain,
  isValidEasyGo,
  performEasyGo
} from '../utils/gameLogic';
import { Card as CardType } from '../utils/types';

const Game: React.FC = () => {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [market, setMarket] = useState<CardType[]>([]);
  const [bankroll, setBankroll] = useState<CardType[]>([]);
  const [easyGo, setEasyGo] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [canFlipRoyals, setCanFlipRoyals] = useState(false);
  const [royalsFlipped, setRoyalsFlipped] = useState(false);
  const [gamePhase, setGamePhase] = useState<'setup' | 'play'>('setup');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newDeck = shuffleDeck(initializeDeck());
    setDeck(newDeck);
    setMarket(newDeck.slice(0, 54)); // All cards except the last two
    setBankroll([]);
    setEasyGo([]);
    setSelectedCards([]);
    setMessage('New game started. Select a Parking Lot to move to the bottom.');
    setCanFlipRoyals(false);
    setRoyalsFlipped(false);
    setGamePhase('setup');
  };

  const calculateScore = () => {
    let score = bankroll.length;
    score += easyGo.filter(card => !card.faceUp).length;
    if (royalsFlipped) {
      const faceUpRoyals = easyGo.filter(card => card.faceUp && ['A', 'K', 'Q', 'J'].includes(card.rank));
      const baseScore = (faceUpRoyals.length * (faceUpRoyals.length + 1)) / 2;
      const aces = faceUpRoyals.filter(card => card.rank === 'A').length;
      score += aces >= 2 ? baseScore * aces : baseScore;
    }
    return score;
  };

  const handleCardClick = (card: CardType) => {
    // Implement card selection logic
  };

  const handleHaul = () => {
    // Implement haul logic
  };

  const handleFleaHop = () => {
    // Implement flea hop logic
  };

  const handleDevilHop = () => {
    // Implement devil hop logic
  };

  const handleWalkyTalky = () => {
    // Implement walky talky logic
  };

  const handleZonkOut = () => {
    // Implement zonk out logic
  };

  const handleHangout = () => {
    // Implement hangout logic
  };

  const handleBargain = () => {
    // Implement bargain logic
  };

  const handleEasyGo = () => {
    // Implement easy go logic
  };

  return (
    <div className="game-container p-4">
      <h1 className="text-3xl font-bold mb-4">Flea Devil Solitaire</h1>
      <div className="game-info mb-4">
        <p>Bankroll: ${bankroll.length}</p>
        <p>Score: ${calculateScore()}</p>
        <p>{message}</p>
      </div>
      <div className="game-areas flex flex-col space-y-4">
        <div className="bankroll-area border border-gray-300 p-2 rounded">
          <h2 className="text-xl font-bold mb-2">Bankroll</h2>
          <div className="card-grid grid grid-cols-8 gap-2">
            {bankroll.map((card, index) => (
              <Card key={index} card={card} onClick={() => handleCardClick(card)} selected={false} />
            ))}
          </div>
        </div>
        <div className="market-area border border-gray-300 p-2 rounded">
          <h2 className="text-xl font-bold mb-2">Market</h2>
          <div className="card-grid grid grid-cols-8 gap-2">
            {market.map((card, index) => (
              <Card key={index} card={card} onClick={() => handleCardClick(card)} selected={selectedCards.includes(card)} />
            ))}
          </div>
        </div>
        <div className="easy-go-area border border-gray-300 p-2 rounded">
          <h2 className="text-xl font-bold mb-2">Easy Go</h2>
          <div className="card-grid grid grid-cols-8 gap-2">
            {easyGo.map((card, index) => (
              <Card key={index} card={card} onClick={() => handleCardClick(card)} selected={false} />
            ))}
          </div>
        </div>
      </div>
      <div className="controls flex flex-wrap gap-2 mt-4">
        <button onClick={startNewGame} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">New Game</button>
        <button onClick={handleHaul} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Haul</button>
        <button onClick={handleFleaHop} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Flea Hop</button>
        <button onClick={handleDevilHop} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Devil Hop</button>
        <button onClick={handleWalkyTalky} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Walky Talky</button>
        <button onClick={handleZonkOut} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Zonk Out</button>
        <button onClick={handleHangout} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Hangout</button>
        <button onClick={handleBargain} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Bargain</button>
        <button onClick={handleEasyGo} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Easy Go</button>
        <button onClick={() => setIsRulesModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Rules</button>
      </div>
      <RulesModal isOpen={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)} />
      <RulesReference />
    </div>
  );
};

export default Game;