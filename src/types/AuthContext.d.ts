import { IUser } from "./user";

export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  checkCurrentUser: (userId: string) => boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export interface IAuthProviderProps {
  children: ReactNode;
}
