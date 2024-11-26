"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

const LoginSchema = z.object({
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
export const LoginPageForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    });
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        console.log(data)
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
                                    <Input placeholder="Enter a password" {...field} disabled={false} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-center ">
                    <Button variant={"default"} type="submit" className="w-32">Submit</Button>
                </div>
                <div className="flex justify-center text-center">
                    <p>
                        Don&apos;t have an account?&nbsp;
                        <Link href="/signup" className="underline underline-offset-4">
                            Signup
                        </Link>
                    </p>
                </div>
            </form>
        </Form>
    );
}