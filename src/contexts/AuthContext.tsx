import { authService } from "@/services/authService";
import type { IAuthContextType, IAuthProviderProps } from "@/types/AuthContext";
import type { IUser } from "@/types/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

const STORAGE_KEYS = {
  USER: 'app_user',
  AUTH_TOKEN: 'auth_token'
};

const AuthContext = createContext<IAuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearError = () => setError(null);

  const saveUserData = (userData: IUser | null) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }

    setUser(userData);
    queryClient.setQueryData(authKeys.user(), userData);
    queryClient.setQueryData(authKeys.session(), {
      isAuthenticated: !!userData,
      user: userData,
    });
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            queryClient.setQueryData(authKeys.user(), parsedUser);
            queryClient.setQueryData(authKeys.session(), {
              isAuthenticated: true,
              user: parsedUser,
            });
            if (storedToken) {
              const result = await authService.checkAuth();

              if (!result.success || !result.payload.isAuthenticated) {
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.USER);
                saveUserData(null);
              }
            } else {
              localStorage.removeItem(STORAGE_KEYS.USER);
              saveUserData(null);
            }
          } catch (parseError) {
            localStorage.removeItem(STORAGE_KEYS.USER);
            saveUserData(null);
          }
        } else {
          saveUserData(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            saveUserData(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [queryClient]);

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.login(credentials.email, credentials.password),
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.payload.access_token);
      saveUserData(data.payload.user);

      setError(null);
      toast.success("Login successful!");
      navigate({
        to: '/task-list',
      });
    },
    onError: (err: any) => {
      setError(err.message || "Login failed");
      toast.error(err.message || "Login failed");
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      saveUserData(null);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.register(credentials.email, credentials.password),
    onSuccess: () => {
      setError(null);
      toast.success("Registration successful! Please log in.");
      navigate({
        to: '/auth/login',
      });
    },
    onError: (err: any) => {
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: () => authService.googleLogin(),
    onSuccess: (data) => {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.payload.access_token);
      saveUserData(data.payload.user);

      toast.success("Google login successful!");
      setError(null);
      navigate({
        to: '/task-list',
      });
    },
    onError: (err: any) => {
      setError(err.message || "Google login failed");
      toast.error(err.message || "Google login failed");
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      saveUserData(null);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      saveUserData(null);

      toast.success("Logged out successfully");
      setError(null);
      navigate({
        to: '/auth/login',
      });
    },
    onError: (err: any) => {
      setError(err.message || "Logout failed");
      toast.error(err.message || "Logout failed");

      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      saveUserData(null);

      navigate({
        to: '/auth/login',
      });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string) => {
    await registerMutation.mutateAsync({ email, password });
  };

  const googleLogin = async () => {
    await googleLoginMutation.mutateAsync();
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const checkCurrentUser = (userId: string): boolean => {
    return user?.id === userId;
  };

  const value: IAuthContextType = {
    user,
    isAuthenticated: !!user,
    checkCurrentUser,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login,
    logout,
    register,
    googleLogin,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};