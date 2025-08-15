import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Hard-coded credentials as requested
    if (username === "ftaco698" && password === "Sasuke01") {
      setIsLoggedIn(true);
      localStorage.setItem("adminSession", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("adminSession");
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
