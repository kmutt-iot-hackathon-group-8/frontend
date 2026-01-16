import React, { createContext, useState, useContext, useEffect } from "react";

interface User {
  uid: number;
  fname: string;
  lname: string;
  email: string;
  cardId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => void;
  loginWithMicrosoft: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://backend-h6j3.onrender.com";

  useEffect(() => {
    // Check if user is already logged in (from BetterAuth session)
    const checkAuth = async () => {
      try {
        // BetterAuth provides a session endpoint
        const response = await fetch(`${BASE_URL}/api/auth/get-session`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser({
              uid: data.user.id,
              fname: data.user.name?.split(" ")[0] || "",
              lname: data.user.name?.split(" ")[1] || "",
              email: data.user.email,
            });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = () => {
    window.location.href = `${BASE_URL}/api/auth/signin/google`;
  };

  const loginWithMicrosoft = () => {
    window.location.href = `${BASE_URL}/api/auth/signin/microsoft`;
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithGoogle,
        loginWithMicrosoft,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
