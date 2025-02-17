'use client';

import { useState, useRef, useEffect } from 'react';

interface Shape {
  id: string;
  type: 'circle' | 'rectangle';
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
}

export default function TheCanvasPainter() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentShape, setCurrentShape] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addShape = (type: 'circle' | 'rectangle') => {
    const newShape: Shape = {
      id: Date.now().toString(),
      type,
      position: { x: 100, y: 100 },
      size: type === 'circle' ? { width: 50, height: 50 } : { width: 80, height: 60 },
      color: type === 'circle' ? '#3B82F6' : '#22C55E', // blue-500 and green-500
    };
    setShapes([...shapes, newShape]);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw each shape
    shapes.forEach((shape) => {
      ctx.beginPath();
      ctx.fillStyle = shape.color;

      if (shape.type === 'circle') {
        ctx.arc(
          shape.position.x,
          shape.position.y,
          shape.size.width / 2,
          0,
          Math.PI * 2
        );
      } else {
        ctx.rect(
          shape.position.x - shape.size.width / 2,
          shape.position.y - shape.size.height / 2,
          shape.size.width,
          shape.size.height
        );
      }
      
      ctx.fill();
    });
  };

  const getShapeAtPosition = (x: number, y: number): string | null => {
    // Check shapes in reverse order (top-most first)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      const dx = x - shape.position.x;
      const dy = y - shape.position.y;

      if (shape.type === 'circle') {
        const radius = shape.size.width / 2;
        if (dx * dx + dy * dy <= radius * radius) {
          return shape.id;
        }
      } else {
        if (
          Math.abs(dx) <= shape.size.width / 2 &&
          Math.abs(dy) <= shape.size.height / 2
        ) {
          return shape.id;
        }
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const hitShapeId = getShapeAtPosition(x, y);
    if (hitShapeId) {
      setIsDragging(true);
      setCurrentShape(hitShapeId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !currentShape || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

  // Set up canvas and start animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with proper scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    ctx.scale(dpr, dpr);

    // Draw function
    const animate = () => {
      draw(ctx);
      requestAnimationFrame(animate);
    };

    animate();
  }, [shapes]); // Redraw when shapes change

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

      <canvas
        ref={canvasRef}
        style={{ width: '800px', height: '600px', border: '2px dashed #D1D5DB' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
} 