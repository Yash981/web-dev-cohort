"use client"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"


const formSchema = z.object({
    firstName: z.string().min(3, { message: "First name must be at least 3 characters long" }),
    lastName: z.string().min(3, { message: "Last name must be at least 3 characters long" }),
    email:z.string().email().optional(),
});
interface UserProfileProps {
    UserfirstName: string
    UserlastName: string
    Useremail: string
}
export const UserProfile = ({ UserfirstName, UserlastName, Useremail }: UserProfileProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
    })
    useEffect(() => {
        form.reset({
            firstName: UserfirstName,
            lastName: UserlastName,
            email: Useremail,
        })
    }, [UserfirstName, UserlastName, Useremail, form])
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })
        if (!response.ok) {
            setIsLoading(false)
            return
        }
        await response.json()
        setIsLoading(false)
        setIsDisabled(false)
        setTimeout(() => {
            setIsLoading(false)
            setIsDisabled(true) // Disable the form again after saving
        }, 1000)
    }
    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 "
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Email</FormLabel>
                            <FormControl>
                                <Input placeholder="abc@gmail.com" {...field} disabled={true} className="bg-white text-black" type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">First Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    disabled={isDisabled}
                                    className="bg-white text-black"
                             
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Last Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    disabled={isDisabled}
                                    className="bg-white text-black"
                                   
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex mx-auto w-full gap-4 justify-center">
                <Button disabled={isLoading} type={isDisabled ? "submit" : "button"} className="flex justify-center " variant={"secondary"} onClick={() => {
                     if (isDisabled) {
                        setIsDisabled(false) 
                    } else {
                        form.handleSubmit(onSubmit)() 
                    }
                }}>{!isDisabled ? "Save Changes" : "Edit Profile"}</Button>
                {!isDisabled &&
                    <Button onClick={()=>{
                        setIsDisabled(true)
                        form.reset()
                    }} type="button" variant="outline" className="flex justify-center px-10">Cancel</Button>
                }
                </div>
            </form>
        </Form>
    )
}