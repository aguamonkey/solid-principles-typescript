import { StrictMode } from "react";
import { describe, it, expect, vi } from "vitest";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfile } from "./good-example/UserProfile";
import { useUserData } from "./good-example/hooks/useUserData";
import { userValidator } from "./good-example/services/userValidator";
import { parseUser } from "./good-example/services/userCodec";
import { MemoryUserStorage } from "./good-example/services/storageService";
import type { UserApi } from "./good-example/services/userApi";
import type { User } from "./good-example/types/User";

const alice: User = { id: "1", name: "Alice", email: "alice@example.com" };
const bob: User = { id: "2", name: "Bob", email: "bob@example.com" };
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
function source() {
  return {
    getUser: vi.fn<UserApi["getUser"]>().mockResolvedValue(alice),
    updateUser: vi
      .fn<UserApi["updateUser"]>()
      .mockImplementation(async (user) => user),
  };
}

function renderProfileHook(api: UserApi) {
  const storage = new MemoryUserStorage();
  return renderHook(() => useUserData(api, storage));
}

describe("contact form policy and runtime boundary", () => {
  it("accepts a usable contact", () =>
    expect(userValidator.validate(alice)).toEqual([]));
  it("reports both invalid fields independently", () =>
    expect(userValidator.validate({ name: " ", email: "invalid" })).toEqual([
      "Enter a name.",
      "Enter a valid email address.",
    ]));
  it.each([
    undefined,
    3,
    {},
    { ...alice, id: "" },
    { ...alice, name: " " },
    { ...alice, email: "bad" },
  ])("rejects malformed runtime data: %j", (value) =>
    expect(() => parseUser(value)).toThrow("Invalid profile response."),
  );
  it("accepts successful empty data", () => expect(parseUser(null)).toBeNull());
  it("drops unrelated response fields", () =>
    expect(parseUser({ ...alice, admin: true })).toEqual(alice));
  it("stores and returns copies independently of callers", () => {
    const storage = new MemoryUserStorage();
    const input = { ...alice };
    storage.saveUser(input);
    input.name = "Changed";
    expect(storage.getUser()).toEqual(alice);
    storage.saveUser(null);
    expect(storage.getUser()).toBeNull();
  });
});

describe("publication policy", () => {
  it("loads through the supplied API and storage", async () => {
    const api = source();
    const storage = new MemoryUserStorage();
    const { result } = renderHook(() => useUserData(api, storage));
    await waitFor(() => expect(result.current.user).toEqual(alice));
    expect(api.getUser).toHaveBeenCalledWith(expect.any(AbortSignal));
    expect(storage.getUser()).toEqual(alice);
  });
  it("retains loaded content after a failed refresh and can recover", async () => {
    const api = source();
    const storage = new MemoryUserStorage();
    const { result } = renderHook(() => useUserData(api, storage));
    await waitFor(() => expect(result.current.user).toEqual(alice));
    api.getUser.mockRejectedValueOnce(new Error("secret transport detail"));
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.user).toEqual(alice);
    expect(result.current.errors.join()).not.toContain("secret");
    api.getUser.mockResolvedValueOnce(bob);
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.user).toEqual(bob);
    expect(result.current.errors).toEqual([]);
  });
  it("initial failure is different from successful empty content", async () => {
    const api = source();
    api.getUser.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderProfileHook(api);
    await waitFor(() => expect(result.current.errors).not.toEqual([]));
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
  it("publishes null on a successful empty response and clears the snapshot", async () => {
    const api = source();
    const storage = new MemoryUserStorage();
    const { result } = renderHook(() => useUserData(api, storage));
    await waitFor(() => expect(result.current.user).toEqual(alice));
    api.getUser.mockResolvedValueOnce(null);
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.errors).toEqual([]);
    expect(storage.getUser()).toBeNull();
  });
  it("malformed input cannot replace a valid profile", async () => {
    const api = source();
    const storage = new MemoryUserStorage();
    const { result } = renderHook(() => useUserData(api, storage));
    await waitFor(() => expect(result.current.user).toEqual(alice));
    api.getUser.mockResolvedValueOnce({ id: 7 });
    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.user).toEqual(alice);
    expect(storage.getUser()).toEqual(alice);
    expect(result.current.errors).not.toEqual([]);
  });
  it("invalid edits never reach the API", async () => {
    const api = source();
    const { result } = renderProfileHook(api);
    await waitFor(() => expect(result.current.user).toEqual(alice));
    await act(async () => {
      await result.current.updateUser({ ...alice, email: "bad" });
    });
    expect(api.updateUser).not.toHaveBeenCalled();
    expect(result.current.user).toEqual(alice);
  });
  it("valid edits publish the acknowledgement and snapshot", async () => {
    const api = source();
    const storage = new MemoryUserStorage();
    const { result } = renderHook(() => useUserData(api, storage));
    await waitFor(() => expect(result.current.user).toEqual(alice));
    const edited = { ...alice, name: "Alicia" };
    await act(async () => {
      await result.current.updateUser(edited);
    });
    expect(api.updateUser).toHaveBeenCalledWith(
      edited,
      expect.any(AbortSignal),
    );
    expect(result.current.user).toEqual(edited);
    expect(storage.getUser()).toEqual(edited);
  });
  it("a receipt for another identity cannot replace the profile", async () => {
    const api = source();
    api.updateUser.mockResolvedValueOnce(bob);
    const { result } = renderProfileHook(api);
    await waitFor(() => expect(result.current.user).toEqual(alice));
    await act(async () => {
      await result.current.updateUser(alice);
    });
    expect(result.current.user).toEqual(alice);
    expect(result.current.errors).not.toEqual([]);
  });
  it("storage failure preserves received content and identifies the failed boundary", async () => {
    const api = source();
    const storage = {
      saveUser: vi.fn().mockImplementation(() => {
        throw new Error("quota");
      }),
    };
    const { result } = renderHook(() => useUserData(api, storage));
    await waitFor(() => expect(result.current.user).toEqual(alice));
    expect(result.current.errors).toEqual([
      "Profile received, but the local snapshot could not be stored.",
    ]);
  });
  it("an older successful response cannot overwrite a newer refresh or its snapshot", async () => {
    const first = deferred<unknown>();
    const second = deferred<unknown>();
    const api = source();
    api.getUser
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    const storage = new MemoryUserStorage();
    const { result } = renderHook(() => useUserData(api, storage));
    let work!: Promise<void>;
    act(() => {
      work = result.current.refresh();
    });
    await act(async () => {
      second.resolve(bob);
      await work;
    });
    await act(async () => {
      first.resolve(alice);
    });
    expect(result.current.user).toEqual(bob);
    expect(storage.getUser()).toEqual(bob);
  });
  it("older failure cannot publish an error after newer success", async () => {
    const first = deferred<unknown>();
    const api = source();
    api.getUser.mockReturnValueOnce(first.promise);
    const { result } = renderProfileHook(api);
    await act(async () => {
      await result.current.refresh();
    });
    await act(async () => {
      first.reject(new Error("late"));
    });
    expect(result.current.user).toEqual(alice);
    expect(result.current.errors).toEqual([]);
  });
  it("switching API aborts old work and rejects its late result", async () => {
    const first = deferred<unknown>();
    const oldApi = source();
    oldApi.getUser.mockReturnValue(first.promise);
    const storage = new MemoryUserStorage();
    const { result, rerender } = renderHook(
      ({ api }) => useUserData(api, storage),
      { initialProps: { api: oldApi } },
    );
    const signal = oldApi.getUser.mock.calls[0][0];
    const nextApi = source();
    nextApi.getUser.mockResolvedValue(bob);
    rerender({ api: nextApi });
    await waitFor(() => expect(result.current.user).toEqual(bob));
    expect(signal.aborted).toBe(true);
    await act(async () => {
      first.resolve(alice);
    });
    expect(result.current.user).toEqual(bob);
    expect(storage.getUser()).toEqual(bob);
  });
  it("unmount aborts work and prevents a late storage side effect", async () => {
    const pending = deferred<unknown>();
    const api = source();
    api.getUser.mockReturnValue(pending.promise);
    const storage = { saveUser: vi.fn() };
    const { unmount } = renderHook(() => useUserData(api, storage));
    const signal = api.getUser.mock.calls[0][0];
    unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => {
      pending.resolve(alice);
    });
    expect(storage.saveUser).not.toHaveBeenCalled();
  });
});

describe("profile interface", () => {
  it("saves the actual edited fields", async () => {
    const api = source();
    const user = userEvent.setup();
    render(<UserProfile api={api} storage={new MemoryUserStorage()} />);
    await screen.findByRole("heading", { name: "Alice" });
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Alicia");
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    await screen.findByRole("heading", { name: "Alicia" });
    expect(api.updateUser.mock.calls[0][0].name).toBe("Alicia");
  });
  it("reports invalid edits while keeping the displayed profile", async () => {
    const api = source();
    const user = userEvent.setup();
    render(<UserProfile api={api} storage={new MemoryUserStorage()} />);
    await screen.findByRole("heading", { name: "Alice" });
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "bad");
    await user.click(screen.getByRole("button", { name: "Save profile" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid email address.",
    );
    expect(api.updateUser).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Alice" })).toBeVisible();
  });
  it("works under StrictMode cleanup and setup", async () => {
    const api = source();
    const storage = new MemoryUserStorage();
    render(
      <StrictMode>
        <UserProfile api={api} storage={storage} />
      </StrictMode>,
    );
    await screen.findByRole("heading", { name: "Alice" });
    expect(api.getUser.mock.calls[0][0].aborted).toBe(true);
    expect(storage.getUser()).toEqual(alice);
  });
});
