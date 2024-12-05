"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignupRouteAction } from "@/actions/auth-route/signup-route-action";
import { useRouter } from "next/navigation";
import { LoginRouteAction } from "@/actions/auth-route/login-route-action";
import { useState } from "react";
import { useUserStore } from "@/stores";

export const AuthFormSchema = z.object({
    username: z.string().min(3).max(20).refine((val) =>
        3 <= val.length && val.length <= 20,
        { message: "Username must be between 3 and 20 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." })
        .max(20, { message: "Password must be at most 20 characters long." })
        .refine(
            (val) => /[A-Z]/.test(val),
            { message: "Password must contain at least one uppercase letter." }
        )
        .refine(
            (val) => /[a-z]/.test(val),
            { message: "Password must contain at least one lowercase letter." }
        )
        .refine(
            (val) => /[0-9]/.test(val),
            { message: "Password must contain at least one number." }
        )
        .refine(
            (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
            { message: "Password must contain at least one special character." }
        )
})
type AuthFormProps = {
    page: string,
}
export const AuthPageForm = ({ page }: AuthFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const { setUsername } = useUserStore()
    const router = useRouter()
    const form = useForm<z.infer<typeof AuthFormSchema>>({
        resolver: zodResolver(AuthFormSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });
    const onSubmit = async (data: z.infer<typeof AuthFormSchema>) => {
        const parsedAuthForm = AuthFormSchema.safeParse(data)
        if (!parsedAuthForm.success) {
            console.log('Invalid Inputs', { message: parsedAuthForm.error.errors })
            return;
        }
        if (page === 'signup') {
            try {
                const response = await SignupRouteAction(parsedAuthForm.data)
                console.log(response, 'response')
                if (!response.success) {
                    console.log(response.errors, 'Error in signingup')
                    setServerError(response.errors.message)
                    return
                }
                router.push('/login')

                return response
            } catch (error) {
                console.log(error, 'Error Signingup')
                setServerError('An unexpected error occurred during signup')
            }

        } else {
            try {
                const response = await LoginRouteAction(parsedAuthForm.data)
                if (!response.success) {
                    console.log(response.errors, 'Error in signingIn')
                    setServerError(response.errors.message)
                    return
                }
                setUsername(response.data.username as string)
                router.push('/')
                return response
            } catch (error) {
                console.log(error, 'Error SigningIn')
                setServerError('An unexpected error occurred during signIn')
            }
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full gap-3 flex flex-col">
                <div className="w-full">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a username" {...field} disabled={false} className="w-full " />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a password" {...field} disabled={false} type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {serverError && (
                    <div className="text-destructive text-sm text-center">
                        {serverError}
                    </div>
                )}
                <div className="flex justify-center ">
                    <Button variant={"default"} type="submit" className="w-32">Submit</Button>
                </div>
                <div className="mx-auto">
                    <Button variant={"link"} type="button" onClick={
                        async () => {
                            try {
                                const response = await LoginRouteAction({ username: "Guest-User", password: "Hello1234@" })
                                setUsername(response.data.username as string)
                                router.push('/')
                                return response
                            } catch (error) {
                                console.log(error, 'Error SigningIn')
                                setServerError('An unexpected error occurred during signIn')
                            }
                        }}>SignIn as Guest</Button>
                </div>
                <div className="flex justify-center text-center">
                    {page === 'signup' ? <p>
                        Already Have an account ?
                        <Link href="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </p> :
                        <p>
                            Don&apos;t have an account?&nbsp;
                            <Link href="/signup" className="underline underline-offset-4">
                                Signup
                            </Link>
                        </p>
                    }
                </div>
            </form>
        </Form>
    );
}