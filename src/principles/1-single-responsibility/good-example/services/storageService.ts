import type { User } from "../types/User";

export interface UserStorage {
  saveUser(user: User | null): void;
}

// Session-local fixture. A browser/disk adapter is a separate extension exercise.
export class MemoryUserStorage implements UserStorage {
  private user: User | null = null;
  saveUser(user: User | null): void {
    this.user = user && { ...user };
  }
  getUser(): User | null {
    return this.user && { ...this.user };
  }
}
