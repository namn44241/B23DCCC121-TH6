import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginFormValues = z.infer<typeof formSchema>;

export const useLoginForm = () => {
    const { login, googleLogin, isLoading } = useAuth();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onLogin = async (data: LoginFormValues) => {
        try {
            await login(data.email, data.password);
        } catch (error) {
            form.setError("email", { message: "Invalid email or password" });
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
        onLogin,
        onGoogleLogin,
        isLoading,
    };
}