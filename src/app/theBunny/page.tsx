'use client';

import { useEffect, useState, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

export default function TheBunny() {
  const [bunnyPosition, setBunnyPosition] = useState<Position>({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [bunnies, setBunnies] = useState<Position[]>([]);
  
  const handleCreateBunny = () => {
    setBunnies([...bunnies, { x: Math.random() * 400, y: Math.random() * 400 }]);
  };

  const handleMouseDown = (index: number) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (isDragging) {
      const newBunnies = [...bunnies];
      newBunnies[index] = {
        x: e.clientX - 50, // offset to center the bunny under cursor
        y: e.clientY - 50,
      };
      setBunnies(newBunnies);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen p-4">
      <button
        onClick={handleCreateBunny}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Bunny
      </button>

      <div 
        className="border border-gray-300 rounded-lg w-[800px] h-[600px] relative"
        onMouseUp={handleMouseUp}
      >
        {bunnies.map((bunny, index) => (
          <svg
            key={index}
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{
              position: 'absolute',
              left: bunny.x,
              top: bunny.y,
              cursor: 'move',
            }}
            onMouseDown={() => handleMouseDown(index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
          >
            {/* Bunny SVG path */}
            <g fill="#8B4513">
              {/* Body */}
              <ellipse cx="50" cy="60" rx="25" ry="20" />
              {/* Head */}
              <circle cx="50" cy="40" r="15" />
              {/* Ears */}
              <path d="M 40 30 Q 35 10 40 25" strokeWidth="4" />
              <path d="M 60 30 Q 65 10 60 25" strokeWidth="4" />
              {/* Eyes */}
              <circle cx="45" cy="35" r="2" fill="black" />
              <circle cx="55" cy="35" r="2" fill="black" />
              {/* Nose */}
              <ellipse cx="50" cy="40" rx="2" ry="1" fill="pink" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
} 