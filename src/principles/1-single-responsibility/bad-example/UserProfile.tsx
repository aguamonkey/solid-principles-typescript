import React, { useState, useEffect } from 'react';

// ❌ BAD: This component violates SRP by having multiple responsibilities
export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  // Responsibility 1: API calls
  const loadUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUser(data);
      saveToLocalStorage(data);
    } catch (error) {
      setErrors(['Failed to load user']);
    } finally {
      setIsLoading(false);
    }
  };

  // Responsibility 2: Local storage management
  const saveToLocalStorage = (userData: any) => {
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Responsibility 3: Validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Responsibility 4: Update operations
  const updateUser = async (updates: any) => {
    if (!validateEmail(updates.email)) {
      setErrors(['Invalid email format']);
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      setUser(data);
      saveToLocalStorage(data);
    } catch (error) {
      setErrors(['Failed to update user']);
    }
  };

  // Responsibility 5: UI rendering
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-gray-600">{user.email}</p>
      {errors.map((error, index) => (
        <div key={index} className="text-red-500">{error}</div>
      ))}
      <button
        onClick={() => updateUser({ ...user, name: 'New Name' })}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Update User
      </button>
    </div>
  );
};
