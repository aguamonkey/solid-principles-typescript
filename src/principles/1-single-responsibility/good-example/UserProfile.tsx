import React from 'react';
import { useUserData } from './hooks/useUserData';
import { UserDisplay } from './components/UserDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';

// ✅ GOOD: This component has a single responsibility - orchestrating the user profile view
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
