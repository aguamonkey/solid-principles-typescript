import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "../types/User";
import type { UserApi } from "../services/userApi";
import type { UserStorage } from "../services/storageService";
import { userValidator } from "../services/userValidator";
import { parseUser } from "../services/userCodec";

// Owns one screen's publication policy. It does not implement validation, storage or transport.
export function useUserData(api: UserApi, storage: UserStorage) {
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const active = useRef<AbortController | null>(null);

  const perform = useCallback(
    async (updates?: User) => {
      active.current?.abort();
      const controller = new AbortController();
      active.current = controller;
      const validation = updates ? userValidator.validate(updates) : [];
      setErrors(validation);
      setLoading(validation.length === 0);
      if (validation.length) return;
      try {
        const raw = updates
          ? await api.updateUser(updates, controller.signal)
          : await api.getUser(controller.signal);
        if (controller.signal.aborted || active.current !== controller) return;
        const incoming = parseUser(raw);
        if (updates && (!incoming || incoming.id !== updates.id))
          throw new Error("Invalid update receipt.");
        setUser(incoming);
        try {
          storage.saveUser(incoming);
        } catch {
          setErrors([
            "Profile received, but the local snapshot could not be stored.",
          ]);
        }
      } catch {
        if (controller.signal.aborted || active.current !== controller) return;
        setErrors([
          "The profile could not be refreshed or saved. Loaded details, if any, are retained.",
        ]);
      } finally {
        if (active.current === controller) {
          active.current = null;
          setLoading(false);
        }
      }
    },
    [api, storage],
  );

  const refresh = useCallback(() => perform(), [perform]);
  const updateUser = useCallback(
    (updates: User) => perform(updates),
    [perform],
  );
  useEffect(() => {
    void refresh();
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [refresh]);

  return { user, errors, isLoading, refresh, updateUser };
}
