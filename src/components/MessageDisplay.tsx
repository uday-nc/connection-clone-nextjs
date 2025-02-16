import React from 'react';

interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error';
}

export const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, type }) => {
  if (!message) return null;

  const baseClasses = "fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate__animated";
  const typeClasses = type === 'success' 
    ? "bg-cyan-500 text-white animate__bounceIn"
    : "bg-red-500 text-white animate__shakeX";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <span role="img" aria-label="success" className="text-xl">✨</span>
        ) : (
          <span role="img" aria-label="error" className="text-xl">❌</span>
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};
