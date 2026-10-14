import type { User } from "../types/User";

// This is deliberately a small contact-form policy, not full email verification.
export const userValidator = {
  validate(user: Pick<User, "name" | "email">): string[] {
    const errors: string[] = [];
    if (!user.name.trim()) errors.push("Enter a name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      errors.push("Enter a valid email address.");
    return errors;
  },
};
