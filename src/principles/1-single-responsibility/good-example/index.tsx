export default `// ✅ GOOD: Each module has a single responsibility

// UserProfile.tsx - Only responsible for rendering
import React from 'react';
import { useUserData } from './hooks/useUserData';
import { UserDisplay } from './components/UserDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';

export const UserProfile: React.FC = () => {
  const { user, errors, isLoading, updateUser } = useUserData();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <div>No user found</div>;

  return (
    <div className="p-4">
      <UserDisplay user={user} />
      <ErrorDisplay errors={errors} />
      <button 
        onClick={() => updateUser({ ...user, name: 'New Name' })}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Update User
      </button>
    </div>
  );
};

// hooks/useUserData.ts - Only responsible for state management
export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    setErrors([]);
    try {
      const data = await userApi.getUser();
      setUser(data);
      storageService.saveUser(data);
    } catch (error) {
      setErrors(['Failed to load user']);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    setErrors([]);
    try {
      const data = await userApi.updateUser(updates);
      setUser(data);
      storageService.saveUser(data);
    } catch (error: any) {
      setErrors([error.message || 'Failed to update user']);
    }
  };

  return { user, errors, isLoading, updateUser };
};

// services/userApi.ts - Only responsible for API calls
class UserApi {
  async getUser(): Promise<User> {
    const response = await fetch('/api/user');
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    const validationErrors = userValidator.validate(updates);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  }
}

// services/userValidator.ts - Only responsible for validation
class UserValidator {
  validate(user: Partial<User>): string[] {
    const errors: string[] = [];

    if (user.email && !this.isValidEmail(user.email)) {
      errors.push('Invalid email format');
    }

    if (user.name && user.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  }
}`;
