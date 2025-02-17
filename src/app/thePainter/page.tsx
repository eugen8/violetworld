'use client';

import { useState, useRef } from 'react';

interface Shape {
  id: string;
  type: 'circle' | 'rectangle';
  position: { x: number; y: number };
}

export default function ThePainter() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentShape, setCurrentShape] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addShape = (type: 'circle' | 'rectangle') => {
    const newShape: Shape = {
      id: Date.now().toString(),
      type,
      position: { x: 50, y: 50 }, // Initial position
    };
    setShapes([...shapes, newShape]);
  };

  const handleMouseDown = (e: React.MouseEvent, shapeId: string) => {
    setIsDragging(true);
    setCurrentShape(shapeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !currentShape || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    setShapes(shapes.map(shape => 
      shape.id === currentShape
        ? { ...shape, position: { x, y } }
        : shape
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentShape(null);
  };

  return (
    <div className="p-8">
      <div className="mb-4 space-x-4">
        <button
          onClick={() => addShape('circle')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Circle
        </button>
        <button
          onClick={() => addShape('rectangle')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Rectangle
        </button>
      </div>

      <div
        ref={canvasRef}
        className="w-[800px] h-[600px] border-2 border-dashed border-gray-300 relative"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {shapes.map((shape) => (
          <div
            key={shape.id}
            onMouseDown={(e) => handleMouseDown(e, shape.id)}
            style={{
              position: 'absolute',
              left: shape.position.x,
              top: shape.position.y,
              cursor: 'move',
              transform: 'translate(-50%, -50%)'
            }}
            className={`
              ${shape.type === 'circle' 
                ? 'w-16 h-16 rounded-full bg-blue-500' 
                : 'w-20 h-16 bg-green-500'}
              transition-colors hover:opacity-80
            `}
          />
        ))}
      </div>
    </div>
  );
} 