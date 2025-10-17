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
// Each class should have only one reason to change

// ❌ BAD: Multiple responsibilities
class UserService {
  validateEmail(email: string): boolean {
    return email.includes('@');
  }
  
  saveUser(user: any): void {
    console.log('Saving to database:', user);
  }
  
  sendWelcomeEmail(user: any): void {
    console.log('Sending email to:', user.email);
  }
}

// ✅ GOOD: Separated responsibilities
class EmailValidator {
  validate(email: string): boolean {
    return email.includes('@');
  }
}

class UserRepository {
  save(user: any): void {
    console.log('Saving to database:', user);
  }
}

class EmailService {
  sendWelcome(email: string): void {
    console.log('Sending welcome email to:', email);
  }
}

// Usage
const validator = new EmailValidator();
const repository = new UserRepository();
const emailService = new EmailService();

const user = { name: 'John', email: 'john@example.com' };
if (validator.validate(user.email)) {
  repository.save(user);
  emailService.sendWelcome(user.email);
}`,

    ocp: `// Open/Closed Principle
// Open for extension, closed for modification

interface Shape {
  calculateArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  
  calculateArea(): number {
    return this.width * this.height;
  }
}

class Circle implements Shape {
  constructor(private radius: number) {}
  
  calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }
}

// New shape added without modifying existing code!
class Triangle implements Shape {
  constructor(private base: number, private height: number) {}
  
  calculateArea(): number {
    return (this.base * this.height) / 2;
  }
}

// Usage
const shapes: Shape[] = [
  new Rectangle(10, 20),
  new Circle(5),
  new Triangle(10, 15)
];

shapes.forEach(shape => {
  console.log('Area:', shape.calculateArea());
});`,

    lsp: `// Liskov Substitution Principle
// Subclasses should be substitutable for their base classes

// ✅ GOOD: Proper abstraction
interface Bird {
  getName(): string;
}

interface FlyingBird extends Bird {
  fly(): void;
}

interface SwimmingBird extends Bird {
  swim(): void;
}

class Eagle implements FlyingBird {
  getName(): string {
    return 'Eagle';
  }
  
  fly(): void {
    console.log('Eagle is flying high!');
  }
}

class Penguin implements SwimmingBird {
  getName(): string {
    return 'Penguin';
  }
  
  swim(): void {
    console.log('Penguin is swimming!');
  }
}

// Both can be used as Bird
function describebird(bird: Bird): void {
  console.log(\`This is a \${bird.getName()}\`);
}

const eagle = new Eagle();
const penguin = new Penguin();

describebird(eagle);   // Works!
describebird(penguin); // Works!`,

    isp: `// Interface Segregation Principle
// Clients shouldn't be forced to depend on interfaces they don't use

// ✅ GOOD: Segregated interfaces
interface Readable {
  read(): string;
}

interface Writable {
  write(data: string): void;
}

interface Deletable {
  delete(): void;
}

// Classes implement only what they need
class ReadOnlyFile implements Readable {
  read(): string {
    return 'File content';
  }
}

class ReadWriteFile implements Readable, Writable {
  private content = '';
  
  read(): string {
    return this.content;
  }
  
  write(data: string): void {
    this.content = data;
    console.log('Written:', data);
  }
}

class SystemFile implements Readable, Writable, Deletable {
  private content = '';
  
  read(): string {
    return this.content;
  }
  
  write(data: string): void {
    this.content = data;
  }
  
  delete(): void {
    this.content = '';
    console.log('File deleted');
  }
}

// Usage - each function only requires what it needs
function readContent(file: Readable): void {
  console.log('Content:', file.read());
}

function saveData(file: Writable, data: string): void {
  file.write(data);
}

const readOnly = new ReadOnlyFile();
const readWrite = new ReadWriteFile();

readContent(readOnly);  // Works!
readContent(readWrite); // Works!
// saveData(readOnly, 'data'); // Won't compile - good!
saveData(readWrite, 'data'); // Works!`,

    dip: `// Dependency Inversion Principle
// Depend on abstractions, not concretions

// Define abstractions
interface Database {
  save(data: any): void;
  find(id: string): any;
}

interface EmailService {
  send(to: string, message: string): void;
}

// Concrete implementations
class MySQLDatabase implements Database {
  save(data: any): void {
    console.log('Saving to MySQL:', data);
  }
  
  find(id: string): any {
    console.log('Finding in MySQL:', id);
    return { id, name: 'John' };
  }
}

class SendGridEmail implements EmailService {
  send(to: string, message: string): void {
    console.log(\`SendGrid email to \${to}: \${message}\`);
  }
}

// High-level module depends on abstractions
class UserService {
  constructor(
    private database: Database,
    private emailService: EmailService
  ) {}
  
  createUser(userData: any): void {
    // Save user
    this.database.save(userData);
    
    // Send welcome email
    this.emailService.send(
      userData.email,
      'Welcome to our platform!'
    );
  }
}

// Dependency injection - easy to swap implementations
const prodUserService = new UserService(
  new MySQLDatabase(),
  new SendGridEmail()
);

// For testing, we could inject mocks
class MockDatabase implements Database {
  save(data: any): void {
    console.log('Mock save:', data);
  }
  find(id: string): any {
    return { id, name: 'Test User' };
  }
}

const testUserService = new UserService(
  new MockDatabase(),
  new SendGridEmail()
);

// Usage
prodUserService.createUser({ 
  name: 'John', 
  email: 'john@example.com' 
});`
  };

  const runCode = () => {
    try {
      setOutput('🚀 Running code...\n');
      // Create a safe execution environment
      const consoleLog = (msg: any) => {
        setOutput(prev => prev + msg + '\n');
      };
      
      // Replace console.log in the code
      const modifiedCode = code.replace(/console\.log/g, 'consoleLog');
      
      // Execute the code (in production, use a proper sandbox)
      const func = new Function('consoleLog', modifiedCode);
      func(consoleLog);
      
      setOutput(prev => prev + '✅ Code executed successfully!');
    } catch (error: any) {
      setOutput(`❌ Error: ${error.message}`);
    }
  };

  const loadTemplate = () => {
    setCode(templates[selectedPrinciple as keyof typeof templates] || templates.srp);
    setOutput('Template loaded! Click "Run" to execute.');
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
              wordWrap: 'on',
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
