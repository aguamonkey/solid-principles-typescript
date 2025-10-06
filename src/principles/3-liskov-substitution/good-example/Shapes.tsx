// ✅ GOOD: Proper abstraction that doesn't violate LSP

// Define behavior through interface, not inheritance
export interface Shape {
  getArea(): number;
  getPerimeter(): number;
  describe(): string;
}

// Rectangle implementation
export class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }

  describe(): string {
    return `Rectangle: ${this.width}x${this.height}`;
  }

  setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}

// Square is its own implementation, not a subclass of Rectangle
export class Square implements Shape {
  constructor(private side: number) {}

  getArea(): number {
    return this.side * this.side;
  }

  getPerimeter(): number {
    return 4 * this.side;
  }

  describe(): string {
    return `Square: ${this.side}x${this.side}`;
  }

  setSide(side: number): void {
    this.side = side;
  }
}

// Circle for demonstration
export class Circle implements Shape {
  constructor(private radius: number) {}

  getArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  describe(): string {
    return `Circle: radius ${this.radius}`;
  }

  setRadius(radius: number): void {
    this.radius = radius;
  }
}

// Function that works with any Shape - LSP is maintained
export function calculateTotalArea(shapes: Shape[]): number {
  return shapes.reduce((total, shape) => total + shape.getArea(), 0);
}

// React component demonstrating proper LSP
import React, { useState } from 'react';

export const ShapeDemo: React.FC = () => {
  const [totalArea, setTotalArea] = useState<number>(0);

  const calculateAreas = () => {
    const shapes: Shape[] = [
      new Rectangle(5, 4),
      new Square(3),
      new Circle(2),
    ];

    // All shapes can be used interchangeably - LSP is satisfied
    const total = calculateTotalArea(shapes);
    setTotalArea(total);

    // Display each shape
    shapes.forEach(shape => {
      console.log(`${shape.describe()}: Area = ${shape.getArea().toFixed(2)}`);
    });
  };

  return (
    <div className="p-4">
      <button 
        onClick={calculateAreas} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Calculate Total Area
      </button>
      {totalArea > 0 && (
        <div className="mt-4">
          <p className="text-lg">Total Area: {totalArea.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            All shapes implement the Shape interface correctly - LSP maintained!
          </p>
        </div>
      )}
    </div>
  );
};
