import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">SOLID</span>
            <span className="ml-2 text-gray-600">Principles</span>
          </div>
          <div className="flex space-x-4">
            <a href="https://github.com" className="text-gray-600 hover:text-gray-800">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
