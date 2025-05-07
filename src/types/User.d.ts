export interface IUser {
    id: string;
    email: string;
    auth_provider: AuthProvider
    role: string;
    avatar?: string;
    banner?: string;
    created_at?: string;
}

export type AuthProvider = "email" | "google"