"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { useGlobalStateManagement } from "../state-management/use-global-state";
import { useState } from "react";
import { useRouter } from "next/navigation";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const formSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" }),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 characters long" }),
    image: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only .jpg, .png, and .webp formats are supported."
        ),
    price: z.preprocess(
        (val) => Number(val),
        z.number().min(1, { message: "Price is required" }),
    ),
})
export const AddAndEditCourseForm = ({currentCourse}:{currentCourse: { courseId: string, title: string, description: string, price: number } | null}) => {  
    // console.log(currentCourse,'currentcourse')

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const { onAddCourseClose,setShouldRefetchCourses } = useGlobalStateManagement();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: currentCourse ? {
            title: currentCourse.title || "",
            description: currentCourse.description || "",
            image: undefined,
            price: currentCourse.price || "",
        } : {
            title: "",
            description: "",
            image: undefined,
            price: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            const parsedData = formSchema.safeParse(values);
            // console.log(parsedData);
            if (!parsedData.success) {
                console.log("Validation failed:", parsedData.error.format());
                return;
            }

            const token = localStorage.getItem("course_selling_token")
            if (!token) {
                // console.log("token not found");
                return;
            }
            const formData = new FormData();
            formData.append("title", parsedData.data.title);
            formData.append("description", parsedData.data.description);
            formData.append("image", parsedData.data.image);
            formData.append("price", parsedData.data.price.toString());
            if(currentCourse){
                formData.append("courseId", currentCourse.courseId);
            }
            // console.log(formData, 'formmmmdata')
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/course`, {
                method: currentCourse ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                },
                credentials: "include",
                body: formData,
            })

            if (!response.ok) {
                console.log("response not ok");
                return;
            }

            await response.json();
            // console.log(result);
            
            onAddCourseClose();
            router.refresh();
            setShouldRefetchCourses(true);
            
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Form {...form}>
            <form
                // @ts-expect-error This is intentionally omitted because react-hook-form's handleSubmit type is not properly recognized by TypeScript
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Enter course title here" {...field} disabled={isLoading} className="text-black bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Description</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter course description here"
                                    {...field}
                                    disabled={isLoading}
                                    className="text-black bg-white"

                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange, value,   ...field } }) => (
                        <FormItem>
                            <FormLabel className="text-white">Course Image</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    disabled={isLoading}
                                    className="text-black bg-white"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            onChange(file);
                                        }
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Price</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter course price" {...field}
                                    disabled={isLoading}
                                    type="text"
                                    className="text-black bg-white"
                                    onChange={(event) => {
                                        const value = event.target.value.replace(/\D/g, "");
                                        field.onChange(value ? Number(value) : "");
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" variant="secondary" disabled={isLoading}>{currentCourse ? "Save Course" : "Add Course"}</Button>
            </form>
        </Form>
    );
}
