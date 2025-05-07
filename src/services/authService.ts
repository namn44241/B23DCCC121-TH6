import type { IUser } from "@/types/User";
import { delay } from "@/utils/functions";

export interface ILoginResponse {
  success: boolean;
  payload: {
    access_token: string;
    token_type: string;
    user: IUser;
  };
}

export interface IRegisterResponse {
  success: boolean;
  payload: {
    user: IUser;
  };
}

export interface ILogoutResponse {
  success: boolean;
}

export interface IGoogleLoginResponse {
  success: boolean;
  payload: {
    access_token: string;
    token_type: string;
    user: IUser;
  };
}

export interface IAuthCheckResponse {
  success: boolean;
  payload: {
    isAuthenticated: boolean;
    user: IUser | null;
  };
}

export const authService = {
  checkAuth: async (): Promise<IAuthCheckResponse> => {
    await delay(500);

    const token = localStorage.getItem("auth_token");

    if (!token) {
      return {
        success: false,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      };
    }

    return {
      success: true,
      payload: {
        isAuthenticated: true,
        user: null, 
      },
    };
  },

  login: async (email: string, password: string): Promise<ILoginResponse> => {
    await delay(1000);
    console.log("Login attempt with email:", email, "and password:", password);

    return {
      success: true,
      payload: {
        access_token: "fake_access_token",
        token_type: "Bearer",
        user: {
          id: "1",
          email: email,
          auth_provider: "email",
          role: "user",
          avatar: "",
          banner: "",
          created_at: new Date().toISOString(),
        },
      },
    };
  },

  // User registration
  register: async (
    email: string,
    password: string
  ): Promise<IRegisterResponse> => {
    await delay(1000);
    console.log(
      "Register attempt with email:",
      email,
      "and password:",
      password
    );

    return {
      success: true,
      payload: {
        user: {
          id: "2",
          email: email,
          auth_provider: "email",
          role: "user",
          avatar: "",
          banner: "",
          created_at: new Date().toISOString(),
        },
      },
    };
  },

  // User logout
  logout: async (): Promise<ILogoutResponse> => {
    await delay(1000);
    return { success: true };
  },

  googleLogin: async (): Promise<IGoogleLoginResponse> => {
    await delay(1000);

    return {
      success: true,
      payload: {
        access_token: "fake_google_access_token",
        token_type: "Bearer",
        user: {
          id: "3",
          email: "google.user@gmail.com",
          auth_provider: "google",
          role: "user",
          avatar: "",
          banner: "",
          created_at: new Date().toISOString(),
        },
      },
    };
  },
};