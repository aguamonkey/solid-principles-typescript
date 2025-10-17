import React from 'react';

interface ErrorDisplayProps {
  errors: string[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errors }) => {
  if (errors.length === 0) return null;
  
  return (
    <div className="error-display">
      {errors.map((error, index) => (
        <div key={index} className="text-red-500 p-2 bg-red-50 rounded mt-2">
          {error}
        </div>
      ))}
    </div>
  );
};
