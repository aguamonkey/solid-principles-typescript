import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Code, Github, BookOpen, Play } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/playground', label: 'Playground', icon: Play },
  ];

  const principles = [
    { id: 1, name: 'single-responsibility', label: 'Single Responsibility', acronym: 'SRP' },
    { id: 2, name: 'open-closed', label: 'Open/Closed', acronym: 'OCP' },
    { id: 3, name: 'liskov-substitution', label: 'Liskov Substitution', acronym: 'LSP' },
    { id: 4, name: 'interface-segregation', label: 'Interface Segregation', acronym: 'ISP' },
    { id: 5, name: 'dependency-inversion', label: 'Dependency Inversion', acronym: 'DIP' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Code className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">SOLID Principles</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
              <a
                href="https://github.com/aguamonkey/solid-principles-typescript"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:text-blue-600"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen sticky top-16">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Principles
            </h3>
            <nav className="space-y-2">
              {principles.map(({ id, name, label, acronym }) => (
                <Link
                  key={id}
                  to={`/principle/${id}-${name}`}
                  className={`block px-4 py-3 rounded-md transition-colors ${
                    location.pathname === `/principle/${id}-${name}`
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{acronym}</span>
                      <span className="block text-xs text-gray-500 mt-1">
                        {label}
                      </span>
                    </div>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {id}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
