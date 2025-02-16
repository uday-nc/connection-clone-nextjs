'use client';

import { useState, useEffect } from 'react';
import { WordTile } from '@/components/WordTile';
import { Modal } from '@/components/Modal';
import { MessageDisplay } from '@/components/MessageDisplay';
import { useGame } from '@/hooks/useGame';
import { useTheme } from '@/hooks/useTheme';
import { Category } from '@/types/game';
import 'animate.css';

export default function Home() {
  const initialWords = ['Word1', 'Word2', 'Word3', 'Word4']; // Fixed set of words
  const [isLoading, setIsLoading] = useState(true);
  const { gameState, handleTileClick, handleSubmit, shuffleCurrentWords, resetGame } = useGame();  
  const { toggleTheme } = useTheme();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  console.log('Rendering Home Component with gameState:', gameState);
  console.log('Game State:', gameState);
  console.log('Selected Tiles:', gameState.selectedTiles);
  console.log('Mistakes Remaining:', gameState.mistakesRemaining);
  console.log('Found Categories:', gameState.foundCategories);

  useEffect(() => {
    console.log('Game State:', gameState);
    console.log('Selected Tiles:', gameState.selectedTiles);
    console.log('Mistakes Remaining:', gameState.mistakesRemaining);
    console.log('Found Categories:', gameState.foundCategories);
  }, [gameState]);

  useEffect(() => {
    // Set loading to false after initial render
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      // Handle touch start event
      console.log('Touch started:', event);
    };

    const handleTouchEnd = (event: TouchEvent) => {
      // Handle touch end event
      console.log('Touch ended:', event);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Don't show game content until after initial client-side render
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)] transition-colors duration-500 p-5">
        <div className="container animate__animated animate__fadeIn">
          <header>
            <div className="header-content">
              <h1 className="text-2xl font-bold">Tech Connections</h1>
            </div>
          </header>
          <div className="grid grid-cols-4 gap-4 mt-8">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="word-tile-placeholder" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = () => {
    const result = handleSubmit();
    if (result.success) {
      setMessageType('success');
      setMessage(`✨ Brilliant! You found: ${result.category?.name}`);
      if (gameState.words.length === 0) {
        setShowCongratulations(true);
      }
    } else {
      setMessageType('error');
      setMessage('Not quite right... Try a different combination!');
      if (gameState.mistakesRemaining <= 1) {
        setShowGameOver(true);
      }
    }
    setTimeout(() => setMessage(''), 2000);
  };

  const handleReset = () => {
    resetGame();
    setShowGameOver(false);
    setShowCongratulations(false);
    setMessage('');
    setMessageType('success');
  };

  return (
    <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)] transition-colors duration-500 p-5">
      <div className="container">
        <header className="animate__animated animate__fadeIn">
          <div className="header-content">
            <h1 className="text-2xl font-bold">Tech Connections</h1>
            <div className="header-buttons">
              <button
                onClick={() => setShowInstructions(true)}
                className="how-to-play-btn"
              >
                How to Play
              </button>
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label="Toggle theme"
              >
                <span className="theme-icon">🌙</span>
              </button>
            </div>
          </div>
          <div className="game-info">
            <div>
              Mistakes Left: <span>{gameState.mistakesRemaining}</span>
            </div>
          </div>
        </header>

        <div id="game-board" className="animate__animated animate__fadeIn">
          <div className="grid">
            {gameState.words.map((word, index) => (
              <WordTile
                key={`${word}-${index}`}
                word={word}
                index={index}
                isSelected={gameState.selectedTiles.includes(index)}
                onClick={handleTileClick}
              />
            ))}
          </div>
        </div>

        <div className="controls animate__animated animate__fadeIn">
          <button
            onClick={onSubmit}
            disabled={gameState.selectedTiles.length !== 4}
            className="primary-button"
            id="submit-btn"
          >
            Submit
          </button>
          <button
            onClick={shuffleCurrentWords}
            className="secondary-button"
            id="shuffle-btn"
          >
            Shuffle
          </button>
        </div>

      <MessageDisplay message={message} type={messageType} />

        <div className="found-categories animate__animated animate__fadeIn">
          {gameState.foundCategories.map((category: Category, index: number) => (
            <div key={index} className={`category ${category.color}`}>
              {category.name}: {category.words.join(', ')}
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showInstructions} onClose={() => setShowInstructions(false)}>
        <h2 className="text-xl font-bold mb-4">How to Play</h2>
        <div className="instructions">
          <p>Find groups of four words that share tech in common.</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Select four words and submit your guess</li>
            <li>Categories would be anything tech related.</li>
            <li>Each puzzle has exactly one solution</li>
            <li>You have 3 mistakes allowed</li>
          </ul>
        </div>
      </Modal>

      <Modal isOpen={showCongratulations} onClose={() => setShowCongratulations(false)}>
        <h2 className="text-xl font-bold mb-4">Congratulations!</h2>
        <p className="mb-4">You won the game!</p>
        <button
          onClick={handleReset}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Try Again
        </button>
      </Modal>

      <Modal isOpen={showGameOver} onClose={() => setShowGameOver(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Game Over!</h2>
          <p className="mb-6 text-lg">You've run out of mistakes. Better luck next time!</p>
          <div className="space-y-4">
            <p className="font-medium">Your Progress:</p>
            <div className="mb-4">
              {gameState.foundCategories.length > 0 ? (
                <div className="space-y-2">
                  <p>Categories Found:</p>
                  {gameState.foundCategories.map((category, index) => (
                    <div key={index} className={`p-2 rounded ${category.color}`}>
                      {category.name}: {category.words.join(', ')}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No categories found</p>
              )}
            </div>
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
