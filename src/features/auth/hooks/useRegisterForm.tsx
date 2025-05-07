import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof formSchema>;

export const useRegisterForm = () => {
    const { register, googleLogin, isLoading } = useAuth();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onRegister = async (data: RegisterFormValues) => {
        try {
            await register(data.email, data.password);
        } catch (error) {
            form.setError("email", { message: "Registration failed. This email might already be in use." });
        }
    }

    const onGoogleLogin = async () => {
        try {
            await googleLogin();
        } catch (error) {
            form.setError("email", { message: "Google login failed" });
        }
    }

    return {
        form,
        onRegister,
        onGoogleLogin,
        isLoading,
    };
}