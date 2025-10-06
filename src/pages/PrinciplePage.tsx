import { useState, useEffect } from 'react';
import { Play, Code, CheckCircle, XCircle, BookOpen, Copy, Check } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('typescript', typescript);

interface PrinciplePageProps {
  principleId: number;
  principleName: string;
}

export default function PrinciplePage({ principleId, principleName }: PrinciplePageProps) {
  const [activeTab, setActiveTab] = useState<'explanation' | 'bad' | 'good' | 'demo'>('explanation');
  const [copied, setCopied] = useState<string | null>(null);
  const [badCode, setBadCode] = useState('');
  const [goodCode, setGoodCode] = useState('');
  const [readmeContent, setReadmeContent] = useState('');

  useEffect(() => {
    // Load the principle's code examples
    loadPrincipleCode();
  }, [principleId, principleName]);

  const loadPrincipleCode = async () => {
    try {
      // Dynamically load the bad example
      const badModule = await import(`../principles/${principleId}-${principleName}/bad-example/index.tsx`);
      setBadCode(badModule.default || '// Bad example code');
      
      // Dynamically load the good example
      const goodModule = await import(`../principles/${principleId}-${principleName}/good-example/index.tsx`);
      setGoodCode(goodModule.default || '// Good example code');
      
      // Load README content
      const readmeModule = await import(`../principles/${principleId}-${principleName}/README.md?raw`);
      setReadmeContent(readmeModule.default || '');
    } catch (error) {
      console.log('Loading static examples...');
      // Fallback to static examples
      setBadCode(getStaticBadExample(principleName));
      setGoodCode(getStaticGoodExample(principleName));
      setReadmeContent(getStaticReadme(principleName));
    }
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const tabs = [
    { id: 'explanation', label: 'Explanation', icon: BookOpen },
    { id: 'bad', label: 'Bad Example', icon: XCircle },
    { id: 'good', label: 'Good Example', icon: CheckCircle },
    { id: 'demo', label: 'Interactive Demo', icon: Play },
  ];

  const principleNames: { [key: string]: string } = {
    'single-responsibility': 'Single Responsibility Principle',
    'open-closed': 'Open/Closed Principle',
    'liskov-substitution': 'Liskov Substitution Principle',
    'interface-segregation': 'Interface Segregation Principle',
    'dependency-inversion': 'Dependency Inversion Principle',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">
            {principleNames[principleName]}
          </h1>
          <p className="text-blue-100">
            Learn through examples, understand through practice
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-1 p-2">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'explanation' && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: readmeContent }} />
            </div>
          )}

          {activeTab === 'bad' && (
            <div>
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-700 font-semibold mb-2">❌ What NOT to do</h3>
                <p className="text-red-600 text-sm">
                  This example violates the {principleNames[principleName]}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(badCode, 'bad')}
                  className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  {copied === 'bad' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <SyntaxHighlighter language="typescript" style={vs2015}>
                  {badCode}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {activeTab === 'good' && (
            <div>
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-green-700 font-semibold mb-2">✅ The right way</h3>
                <p className="text-green-600 text-sm">
                  This example properly implements the {principleNames[principleName]}
                </p>
              </div>
              <div className="relative">
                <button
                  onClick={() => copyToClipboard(goodCode, 'good')}
                  className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                >
                  {copied === 'good' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <SyntaxHighlighter language="typescript" style={vs2015}>
                  {goodCode}
                </SyntaxHighlighter>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Demo Coming Soon</h3>
              <p className="text-gray-600">
                The interactive demonstration will be available in the playground.
              </p>
              <a
                href="/playground"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Go to Playground
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Static fallback examples
function getStaticBadExample(principle: string): string {
  const examples: { [key: string]: string } = {
    'single-responsibility': `// ❌ BAD: Multiple responsibilities in one class
class UserProfile {
  constructor() {}
  
  // Responsibility 1: Display
  render() { /* ... */ }
  
  // Responsibility 2: API calls
  fetchUser() { /* ... */ }
  
  // Responsibility 3: Validation
  validateEmail() { /* ... */ }
  
  // Responsibility 4: Storage
  saveToLocalStorage() { /* ... */ }
}`,
    // Add other principles...
  };
  return examples[principle] || '// Example not found';
}

function getStaticGoodExample(principle: string): string {
  const examples: { [key: string]: string } = {
    'single-responsibility': `// ✅ GOOD: Single responsibility per class
class UserDisplay {
  render() { /* Only display logic */ }
}

class UserAPI {
  fetchUser() { /* Only API logic */ }
}

class UserValidator {
  validateEmail() { /* Only validation logic */ }
}

class UserStorage {
  save() { /* Only storage logic */ }
}`,
    // Add other principles...
  };
  return examples[principle] || '// Example not found';
}

function getStaticReadme(principle: string): string {
  const readmes: { [key: string]: string } = {
    'single-responsibility': `
<h2>Single Responsibility Principle</h2>
<p>A class should have only one reason to change.</p>
<h3>Benefits</h3>
<ul>
  <li>Easier to test</li>
  <li>Easier to maintain</li>
  <li>Easier to understand</li>
</ul>
    `,
    // Add other principles...
  };
  return readmes[principle] || '<p>Documentation coming soon...</p>';
}
