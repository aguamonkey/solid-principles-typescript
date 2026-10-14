import type { User } from "../types/User";

// Type annotations cannot validate data at the runtime boundary.
export function parseUser(value: unknown): User | null {
  if (value === null) return null;
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("name" in value) ||
    !("email" in value)
  ) {
    throw new Error("Invalid profile response.");
  }
  const { id, name, email } = value;
  if (
    typeof id !== "string" ||
    !id.trim() ||
    typeof name !== "string" ||
    typeof email !== "string"
  ) {
    throw new Error("Invalid profile response.");
  }
  if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Invalid profile response.");
  return { id, name, email };
}
