'use client';

import React from 'react';

interface WordTileProps {
    word: string;
    index: number;
    isSelected: boolean;
    onClick: (index: number) => void;
}

export const WordTile = ({ word, index, isSelected, onClick }: WordTileProps) => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return <div className="word-tile-placeholder" />;
    }

    return (
        <button
            className={`word-tile animate__animated ${isSelected ? 'selected animate__pulse' : ''}`}
            onClick={() => onClick(index)}
            data-index={index}
        >
            {word}
        </button>
    );
};
