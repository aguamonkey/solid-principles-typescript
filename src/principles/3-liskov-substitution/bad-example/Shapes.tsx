// ❌ BAD: Square violates LSP when substituted for Rectangle

export class Rectangle {
  protected width: number = 0;
  protected height: number = 0;

  setWidth(width: number): void {
    this.width = width;
  }

  setHeight(height: number): void {
    this.height = height;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

// Square violates LSP - it changes the behavior of setWidth and setHeight
export class Square extends Rectangle {
  // Setting width also sets height - unexpected behavior!
  setWidth(width: number): void {
    this.width = width;
    this.height = width; // Violation: changing parent's expected behavior
  }

  // Setting height also sets width - unexpected behavior!
  setHeight(height: number): void {
    this.width = height;
    this.height = height; // Violation: changing parent's expected behavior
  }
}

// This function expects Rectangle behavior but breaks with Square
export function resizeRectangle(rectangle: Rectangle): void {
  rectangle.setWidth(5);
  rectangle.setHeight(4);
  
  // This assertion fails for Square!
  const expectedArea = 20;
  const actualArea = rectangle.getArea();
  
  if (actualArea !== expectedArea) {
    throw new Error(`Expected area ${expectedArea}, but got ${actualArea}`);
  }
}

// React component demonstrating the problem
import React, { useState } from 'react';

export const ShapeDemo: React.FC = () => {
  const [error, setError] = useState<string>('');

  const testRectangle = () => {
    try {
      const rect = new Rectangle();
      resizeRectangle(rect);
      setError('');
      console.log('Rectangle works fine!');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const testSquare = () => {
    try {
      const square = new Square();
      resizeRectangle(square); // Violates LSP - throws error!
      setError('');
      console.log('Square works fine!');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-4">
      <button onClick={testRectangle} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">
        Test Rectangle
      </button>
      <button onClick={testSquare} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">
        Test Square (Breaks!)
      </button>
      {error && <div className="mt-4 text-red-600">Error: {error}</div>}
    </div>
  );
};
