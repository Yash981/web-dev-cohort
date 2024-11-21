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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const AddContentSchema = z.object({
    title: z.string().min(3, "Minimum 3 Characters required"),
    type: z.enum(["IMAGE", "VIDEO", "ARTICLE", "AUDIO"], { message: "Invalid content type" }),
    link: z.string(),
    tags: z.array(z.string())
})

export const FormFields = () => {
    const form = useForm<z.infer<typeof AddContentSchema>>({
        resolver: zodResolver(AddContentSchema),
        defaultValues: {
            title: "",
            type: undefined,
            link: "",
            tags: undefined
        }
    });

    const onSubmit = () => {

    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Please Enter Title Here</FormLabel>
                            <FormControl>
                                <Input placeholder="title" {...field} disabled={false} className="text-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Password</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={'IMAGE'}>Image</SelectItem>
                                    <SelectItem value={'ARTICLE'}>Documents</SelectItem>
                                    <SelectItem value={'VIDEO'}>Youtube or tweet Link</SelectItem>
                                    <SelectItem value={'AUDIO'}>Youtube or tweet Link</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="secondary" disabled={false}>Add Note</Button>
            </form>
        </Form>
    )
}