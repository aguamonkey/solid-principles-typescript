import type { User } from "../types/User";

export interface UserApi {
  getUser(signal: AbortSignal): Promise<unknown>;
  updateUser(user: User, signal: AbortSignal): Promise<unknown>;
}

export class SampleUserApi implements UserApi {
  private user: User = {
    id: "member-037",
    name: "Morgan Ellis",
    email: "morgan@example.com",
  };
  private offline = false;
  setOffline(offline: boolean): void {
    this.offline = offline;
  }
  async getUser(signal: AbortSignal): Promise<unknown> {
    signal.throwIfAborted();
    if (this.offline) throw new Error("Sample source is offline.");
    return { ...this.user };
  }
  async updateUser(user: User, signal: AbortSignal): Promise<unknown> {
    signal.throwIfAborted();
    if (this.offline) throw new Error("Sample source is offline.");
    this.user = { ...user };
    return { ...this.user };
  }
}
