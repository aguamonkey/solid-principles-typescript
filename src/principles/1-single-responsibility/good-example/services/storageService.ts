import { User } from '../types/User';

class StorageService {
  private readonly USER_KEY = 'user_data';

  saveUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }

  getUser(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user from storage:', error);
      return null;
    }
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}

export const storageService = new StorageService();
