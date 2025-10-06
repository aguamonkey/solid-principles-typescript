import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RefreshCw, Save } from 'lucide-react';

export default function InteractivePlayground() {
  const [code, setCode] = useState(`// Welcome to the SOLID Principles Playground!
// Try implementing any of the SOLID principles here.

class Example {
  constructor(private name: string) {}
  
  greet(): string {
    return \`Hello, \${this.name}!\`;
  }
}

const example = new Example("SOLID");
console.log(example.greet());
`);
  const [output, setOutput] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState('srp');

  const templates = {
    srp: `// Single Responsibility Principle
class User {
  constructor(public name: string, public email: string) {}
}

// Try separating these responsibilities
class UserService {
  validateEmail(email: string): boolean {
    // Validation logic
    return email.includes('@');
  }
  
  saveUser(user: User): void {
    // Database logic
    console.log('Saving user:', user);
  }
  
  sendWelcomeEmail(user: User): void {
    // Email logic
    console.log('Sending email to:', user.email);
  }
}`,
    ocp: `// Open/Closed Principle
// Implement a shape calculator that's open for extension

interface Shape {
  calculateArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  
  calculateArea(): number {
    return this.width * this.height;
  }
}

// Add more shapes without modifying existing code!`,
  };

  const runCode = () => {
    try {
      setOutput('🚀 Running code...\n');
      // In production, you'd use a sandboxed environment
      const result = Function('"use strict"; ' + code)();
      setOutput(prev => prev + '✅ Code executed successfully!\n' + (result || ''));
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
    }
  };

  const loadTemplate = () => {
    setCode(templates[selectedPrinciple as keyof typeof templates] || templates.srp);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Interactive Playground</h1>
            <p className="text-gray-600">
              Practice implementing SOLID principles in real-time
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPrinciple}
              onChange={(e) => setSelectedPrinciple(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded"
            >
              <option value="srp">Single Responsibility</option>
              <option value="ocp">Open/Closed</option>
              <option value="lsp">Liskov Substitution</option>
              <option value="isp">Interface Segregation</option>
              <option value="dip">Dependency Inversion</option>
            </select>
            <button
              onClick={loadTemplate}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Load Template
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">TypeScript Editor</span>
            <div className="flex space-x-2">
              <button
                onClick={runCode}
                className="px-3 py-1 bg-blue-600 text-white rounded flex items-center space-x-1 hover:bg-blue-700"
              >
                <Play className="w-4 h-4" />
                <span>Run</span>
              </button>
            </div>
          </div>
          <Editor
            height="500px"
            defaultLanguage="typescript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              tabSize: 2,
            }}
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="font-semibold">Output</span>
            <button
              onClick={() => setOutput('')}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <pre className="p-4 bg-gray-900 text-green-400 h-[500px] overflow-auto font-mono text-sm whitespace-pre-wrap">
            {output || 'Output will appear here...\n\nClick "Run" to execute your code!'}
          </pre>
        </div>
      </div>
    </div>
  );
}
