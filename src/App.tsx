import React from 'react';
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          SOLID Principles with TypeScript and React
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PrincipleCard
            title="Single Responsibility"
            description="A class should have only one reason to change"
            link="/principles/1-single-responsibility"
          />
          <PrincipleCard
            title="Open/Closed"
            description="Software entities should be open for extension, but closed for modification"
            link="/principles/2-open-closed"
          />
          <PrincipleCard
            title="Liskov Substitution"
            description="Objects of a superclass should be replaceable with objects of its subclasses"
            link="/principles/3-liskov-substitution"
          />
          <PrincipleCard
            title="Interface Segregation"
            description="Clients should not be forced to depend on interfaces they do not use"
            link="/principles/4-interface-segregation"
          />
          <PrincipleCard
            title="Dependency Inversion"
            description="High-level modules should not depend on low-level modules"
            link="/principles/5-dependency-inversion"
          />
        </div>
      </main>
    </div>
  );
}

interface PrincipleCardProps {
  title: string;
  description: string;
  link: string;
}

function PrincipleCard({ title, description }: PrincipleCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;
