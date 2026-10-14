import { useEffect, useState } from "react";
import { useUserData } from "./hooks/useUserData";
import { UserDisplay } from "./components/UserDisplay";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { SampleUserApi, type UserApi } from "./services/userApi";
import { MemoryUserStorage, type UserStorage } from "./services/storageService";

export function UserProfile({
  api,
  storage,
}: {
  api: UserApi;
  storage: UserStorage;
}) {
  const { user, errors, isLoading, refresh, updateUser } = useUserData(
    api,
    storage,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);
  return (
    <section className="profile-sheet" aria-label="Contact profile">
      <p className="eyebrow">MEMBER SERVICES / CARD 037</p>
      {isLoading && <LoadingSpinner />}
      {user ? (
        <>
          <UserDisplay user={user} />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void updateUser({ ...user, name, email });
            }}
            noValidate
          >
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>
            <button disabled={isLoading}>Save profile</button>
          </form>
        </>
      ) : (
        !isLoading && <p>No profile has been loaded.</p>
      )}
      <ErrorDisplay errors={errors} />
      <button
        type="button"
        disabled={isLoading}
        onClick={() => {
          void refresh();
        }}
      >
        Refresh profile
      </button>
    </section>
  );
}

export function ProfileDemo() {
  const [api] = useState(() => new SampleUserApi());
  const [storage] = useState(() => new MemoryUserStorage());
  const [offline, setOffline] = useState(false);
  return (
    <div>
      <label className="fixture-control">
        <input
          type="checkbox"
          checked={offline}
          onChange={(event) => {
            setOffline(event.target.checked);
            api.setOffline(event.target.checked);
          }}
        />{" "}
        Sample source offline
      </label>
      <UserProfile api={api} storage={storage} />
      <p className="scope-note">
        Local sample data and session memory. No account, email or network
        service is used.
      </p>
    </div>
  );
}
