import { useState, useCallback, useEffect } from 'react';
import { GameState, Category } from '@/types/game';
import { gameData } from '@/data/gameData';

const selectRandomCategories = () => {
    const shuffled = [...gameData.categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
};

const shuffleWords = (words: string[]) => {
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>(() => {
        if (typeof window === 'undefined') {
            // Return a default state for server-side rendering
            return {
                categories: [],
                words: [],
                selectedTiles: [],
                foundCategories: [],
                mistakesRemaining: 3
            };
        }
        // Client-side initialization
        const selectedCategories = selectRandomCategories();
        return {
            categories: selectedCategories,
            words: shuffleWords(selectedCategories.flatMap(category => category.words)),
            selectedTiles: [],
            foundCategories: [],
            mistakesRemaining: 3
        };
    });

    // Initialize the game on the client side
    useEffect(() => {
        if (gameState.words.length === 0) {
            const selectedCategories = selectRandomCategories();
            setGameState({
                categories: selectedCategories,
                words: shuffleWords(selectedCategories.flatMap(category => category.words)),
                selectedTiles: [],
                foundCategories: [],
                mistakesRemaining: 3
            });
        }
    }, []);

    const handleTileClick = useCallback((index: number) => {
        setGameState(prev => {
            const tileIndex = prev.selectedTiles.indexOf(index);
            if (tileIndex === -1 && prev.selectedTiles.length < 4) {
                return {
                    ...prev,
                    selectedTiles: [...prev.selectedTiles, index]
                };
            } else if (tileIndex !== -1) {
                const newSelectedTiles = [...prev.selectedTiles];
                newSelectedTiles.splice(tileIndex, 1);
                return {
                    ...prev,
                    selectedTiles: newSelectedTiles
                };
            }
            return prev;
        });
    }, []);

    const checkSelection = useCallback(() => {
        const selectedWords = gameState.selectedTiles.map(index => gameState.words[index]);
        return gameState.categories.find(category => 
            category.words.every(word => selectedWords.includes(word))
        );
    }, [gameState.categories, gameState.selectedTiles, gameState.words]);

    const handleSubmit = useCallback(() => {
        const category = checkSelection();
        
        if (category) {
            setGameState(prev => ({
                ...prev,
                words: prev.words.filter(word => !category.words.includes(word)),
                selectedTiles: [],
                foundCategories: [...prev.foundCategories, category],
                categories: prev.categories.filter(c => c !== category)
            }));
            return { success: true, category };
        } else {
            setGameState(prev => ({
                ...prev,
                selectedTiles: [],
                mistakesRemaining: prev.mistakesRemaining - 1
            }));
            return { success: false };
        }
    }, [checkSelection]);

    const shuffleCurrentWords = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            words: shuffleWords(prev.words),
            selectedTiles: []
        }));
    }, []);

    const resetGame = useCallback(() => {
        const selectedCategories = selectRandomCategories();
        setGameState({
            categories: selectedCategories,
            words: shuffleWords(selectedCategories.flatMap(category => category.words)),
            selectedTiles: [],
            foundCategories: [],
            mistakesRemaining: 3
        });
    }, []);

    return {
        gameState,
        handleTileClick,
        handleSubmit,
        shuffleCurrentWords,
        resetGame
    };
};
