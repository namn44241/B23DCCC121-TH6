import { Icons } from "@/components/common/Icons"
import { Link } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { useLoginForm } from "../hooks/useLoginForm"

export const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const { form, onLogin, onGoogleLogin, isLoading } = useLoginForm();

    return (
        <div className={cn("flex flex-col items-center gap-6 w-full", className)} {...props}>
            <div className="flex flex-col items-center gap-2">
                <Link
                    to="/"
                >
                    <p className="text-center text-primary font-semibold">{siteConfig.name}</p>
                </Link>
                <p className="text-xl font-bold">Login to your account</p>
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/auth/register" className="underline underline-offset-4">
                        Create an account
                    </Link>
                </p>
            </div>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onLogin)} className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="email@example.com"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Ranndom password with 6+ characters"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Login...
                            </>
                        ) :
                            "Login"}
                    </Button>
                </form>
            </Form>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or
                </span>
            </div>

            <Button variant="outline" className="w-full" onClick={onGoogleLogin}>
                <Icons.google className="size-4 mr-2" />
                Continue with Google
            </Button>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking login, you agree to our <Link to="/term-of-service">Terms of Service</Link>{" "}
                and <Link to="/privacy-policy">Privacy Policy</Link>.
            </div>
        </div>
    )
}
