import React from 'react';
import { User } from '../types/User';

interface UserDisplayProps {
  user: User;
}

export const UserDisplay: React.FC<UserDisplayProps> = ({ user }) => {
  return (
    <div className="user-display">
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
};
