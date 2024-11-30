"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FileText, Image as Img, Link as LinkIcon, Type } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import MarkdownEditor from "./markdown-editor"
import { useState } from "react"
import { TagInput } from "./ui/tag-input"
import Image from "next/image"
import { AddContents } from "@/app/actions/add-content-action"
import { useRouter } from "next/navigation"
import { useDialogStore } from "@/stores"
const AddContentSchema = z.object({
    title: z.string().min(3, "Minimum 3 Characters required"),
    type: z.enum(["IMAGE", "ARTICLE", "LINK"], {
        message: "Please select a valid content type",
    }),
    image: z
        .instanceof(File)
        .optional(),
    link: z.string().optional(),
    tags: z
        .array(z.string().max(15, 'Too long name'))
        .max(20, 'Too many tags')
        .nonempty('At least one tag is required'),
    tag: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.type === "IMAGE" && !data.image) {
        ctx.addIssue({
            path: ["image"],
            message: "Image is required for IMAGE type",
            code: z.ZodIssueCode.custom,
        });
    }
    if (data.type === "LINK" && !data.link) {
        ctx.addIssue({
            path: ["link"],
            message: "Link is required for LINKS type",
            code: z.ZodIssueCode.custom,
        });
    }
    if (data.tags.length === 0) {
        ctx.addIssue({
            path: ["tags"],
            message: "At least one tag is required",
            code: z.ZodIssueCode.custom,
        });
    }
});

export const FormFields = () => {
    const { onClose} = useDialogStore()
    const [, setImagePreview] = useState<any>(null);
    const router = useRouter()
    const [showField, setShowField] = useState('')
    const form = useForm<z.infer<typeof AddContentSchema>>({
        resolver: zodResolver(AddContentSchema),
        defaultValues: {
            title: "",
            type: undefined,
            image: undefined,
            link: "",
            tags: [],
            tag: "",
        }
    });

    const onSubmit = async (data: z.infer<typeof AddContentSchema>) => {
        const response = AddContentSchema.safeParse(data)
        console.log(response.data,response.success,response.error)
        if(!response.success){
            console.log("Invalid Inputttt",response.error)
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('type', data.type);
            if (data.type === 'LINK' && data.link) {
                formData.append('link', data.link);
            }
            if (data.type === 'IMAGE' && data.image) {
                formData.append('image', data.image);
            }
            data.tags.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });
            const res = await AddContents(formData)
            onClose()
            router.refresh()
            console.log(res,'resss')
            return res
        } catch (error) {
            console.log('error in adding',error)
        }

    }
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'IMAGE':
                return <Img className="w-4 h-4" />
            case 'ARTICLE':
                return <FileText className="w-4 h-4" />
            case 'LINK':
                return <LinkIcon className="w-4 h-4" />
            default:
                return <Type className="w-4 h-4" />
        }
    }
    return (
        <div className="w-full">
            <Form {...form} >
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter a descriptive title" {...field} disabled={false} />
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
                                <FormLabel >Content Type</FormLabel>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);
                                    setShowField(value);
                                }}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup >
                                            <SelectLabel className="pl-1">Please Select a Type</SelectLabel>
                                            {['IMAGE', 'ARTICLE', 'LINK'].map((type) => (
                                                <SelectItem key={type} value={type} className="flex w-full pl-1">
                                                    <div className="flex gap-2 ">
                                                        {getTypeIcon(type)}
                                                        <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {showField === 'IMAGE' && (
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-semibold">Upload Image</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 bg-background/50 border-border/40">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Img className="w-8 h-8 mb-2 text-primary/60" />
                                                    <p className="mb-2 text-sm"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                                    <p className="text-xs text-muted-foreground">PNG, JPG or JPEG</p>
                                                </div>
                                                <Input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files ? e.target.files[0] : null;
                                                        if (file) {
                                                            // Update the field with the selected image file
                                                            console.log(e.target.files,'etargetfiles')
                                                            field.onChange(file);
                                                            setImagePreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    accept=".jpg, .jpeg, .png"
                                                />
                                            </label>
                                        </div>
                                    </FormControl>
                                    {field.value && (
                                        <div className="mt-4 flex flex-col items-center">
                                            <Image src={URL.createObjectURL(field.value)} alt="Uploaded Preview" className="w-32 h-32 object-cover mb-2" width={32} height={32} />
                                            <p className="text-sm text-success">Image uploaded successfully!</p>
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {showField === 'ARTICLE' && <MarkdownEditor />}
                    {showField === 'LINK' &&
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >External Link</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                type="text"
                                                {...field}
                                                className="pl-10 h-11 bg-background/50"
                                                placeholder="Paste your YouTube or Twitter link"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <TagInput
                                        {...field}
                                        placeholder="Add Tags(Press Enter or SpaceBar)"
                                        arrayProp={'tags'}
                                        required={false}
                                        maxlength={15}
                                    />
                                </FormControl>
                                <FormMessage>{form.formState.errors.tags?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant="default">Add Note</Button>
                </form>
            </Form>
        </div>
    )
}