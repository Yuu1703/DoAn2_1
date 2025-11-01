// context/UserContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const UserContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUser(data.user || null);
    } catch (e) {
      console.error(e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <UserContext.Provider value={{ user, loading, refresh: fetchMe }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
