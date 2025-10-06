import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code, Zap } from 'lucide-react';

export default function HomePage() {
  const principles = [
    {
      id: 1,
      name: 'single-responsibility',
      title: 'Single Responsibility',
      description: 'A class should have only one reason to change',
      color: 'from-blue-500 to-cyan-500',
      icon: '📦'
    },
    {
      id: 2,
      name: 'open-closed',
      title: 'Open/Closed',
      description: 'Software entities should be open for extension, but closed for modification',
      color: 'from-purple-500 to-pink-500',
      icon: '🔐'
    },
    {
      id: 3,
      name: 'liskov-substitution',
      title: 'Liskov Substitution',
      description: 'Objects of a superclass should be replaceable with objects of its subclasses',
      color: 'from-green-500 to-teal-500',
      icon: '🔄'
    },
    {
      id: 4,
      name: 'interface-segregation',
      title: 'Interface Segregation',
      description: 'Clients should not be forced to depend on interfaces they do not use',
      color: 'from-orange-500 to-red-500',
      icon: '✂️'
    },
    {
      id: 5,
      name: 'dependency-inversion',
      title: 'Dependency Inversion',
      description: 'High-level modules should not depend on low-level modules',
      color: 'from-indigo-500 to-purple-500',
      icon: '⚡'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Master SOLID Principles
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn the five fundamental principles of object-oriented design through interactive examples,
          real-world scenarios, and hands-on practice with TypeScript and React.
        </p>
        
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/playground"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Code className="w-5 h-5" />
            <span>Try Playground</span>
          </Link>
          <a
            href="https://github.com/aguamonkey/solid-principles-typescript"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      {/* Principles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {principles.map((principle) => (
          <Link
            key={principle.id}
            to={`/principle/${principle.id}-${principle.name}`}
            className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${principle.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{principle.icon}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded bg-gradient-to-r ${principle.color} text-white`}>
                  Principle {principle.id}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {principle.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {principle.description}
              </p>
              
              <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Interactive Examples</h3>
          <p className="text-gray-600">See bad and good implementations side by side</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Live Playground</h3>
          <p className="text-gray-600">Try the principles yourself in real-time</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Comprehensive Tests</h3>
          <p className="text-gray-600">Learn through testing and validation</p>
        </div>
      </div>
    </div>
  );
}
