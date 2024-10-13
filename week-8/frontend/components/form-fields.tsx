"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signin, signup } from "@/services/auth-service"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGlobalStateManagement } from "../state-management/use-global-state"

const signInSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .refine((val) => /[a-z]/.test(val), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((val) => /[A-Z]/.test(val), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((val) => /[0-9]/.test(val), {
            message: "Password must contain at least one digit",
        })
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
            message: "Password must contain at least one special character",
        }),
})
const signUpSchema = signInSchema.extend({
    firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
});


type FormValues<T extends boolean> = T extends true
    ? z.infer<typeof signInSchema>
    : z.infer<typeof signUpSchema>;

type Props<T extends boolean> = {
    SignInDialogToshow: T;
};
export const FormFields = <T extends boolean>({ SignInDialogToshow }: Props<T>) => {
    const { onClose, onUserNickName, loginAsUser,onLoginClose,onAdminRole } = useGlobalStateManagement()
    const schema = SignInDialogToshow ? signInSchema : signUpSchema;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const form = useForm<FormValues<T>>({
        resolver: zodResolver(schema),
        //@ts-expect-error This is used because we're using a conditional type in the defaultValues property
        defaultValues: SignInDialogToshow
            ? ({ email: "", password: "" } as FormValues<true>)
            : ({ email: "", password: "", firstName: "", lastName: "" } as FormValues<false>),
    });

    const onSubmit = async (data: FormValues<T>) => {
        if (loginAsUser) {
            try {
                setIsLoading(true);
                if (SignInDialogToshow) {
                    const { token, firstName, lastName } = await signin(data, "user");
                    onUserNickName(firstName + " " + lastName)
                    localStorage.setItem("course_selling_token", token);
                    onLoginClose();
                    onClose()
                    router.push("/profile")
                } else {
                    // @ts-expect-error This is used because we're using a conditional type in the name property
                    const response = await signup(data,"user");
                    onUserNickName(response.profile.firstName + " " + response.profile.lastName)
                    localStorage.setItem("course_selling_token", response.token);
                    onLoginClose();
                    onClose()
                    router.push("/profile")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                if (SignInDialogToshow) {
                    const { token, firstName, lastName,isAdmin } = await signin(data, "admin");
                    onUserNickName(firstName + " " + lastName)
                    localStorage.setItem("course_selling_token", token);
                    onLoginClose();
                    onClose()
                    if(isAdmin){
                        onAdminRole(true);
                    }
                    router.push("/profile")
                } else {
                    // @ts-expect-error This is used because we're using a conditional type in the name property
                    const response = await signup(data,"admin");
                    onUserNickName(response.profile.firstName + " " + response.profile.lastName)
                    localStorage.setItem("course_selling_token", response.token);
                    onLoginClose();
                    onClose()
                    if(response.profile.isAdmin){
                        onAdminRole(true);
                    }
                    router.push("/profile")
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    // @ts-expect-error This is used because we're using a conditional type in the name property
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="abc@gmail.com" {...field} disabled={isLoading} className="text-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    // @ts-expect-error This is used because we're using a conditional type in the name property
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    {...field}
                                    disabled={isLoading}
                                    className="text-white"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!SignInDialogToshow && (
                    <>
                        <FormField
                            control={form.control}
                            // @ts-expect-error This is used because we're using a conditional type in the name property
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">First Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            {...field}
                                            disabled={isLoading}
                                            className="text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            // @ts-expect-error This is used because we're using a conditional type in the name property
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last Name" {...field}
                                            disabled={isLoading}
                                            className="text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}
                <Button type="submit" variant="secondary" disabled={isLoading}>{SignInDialogToshow ? 'Log in' : 'Create account'}</Button>
            </form>
        </Form>
    )
}
