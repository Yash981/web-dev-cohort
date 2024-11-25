"use client"
import { ContentsProp, Tag } from "@/app/page";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {  Share2Icon } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import Script from "next/script";
import { AlertDialogDelete } from "./delete-alert-dialog";
const NotesCards = ({ link, title, type, createdAt, tags,id }: ContentsProp) => {
    
    return (
        <>
            <Card className="w-[350px]  mt-10 min-h-52">
                <CardHeader className="flex justify-between flex-row">
                    <CardTitle>{title}</CardTitle>
                    <div className="flex gap-4">
                        <Share2Icon cursor={"pointer"} />
                        <AlertDialogDelete id={id}/> 
                    </div>
                </CardHeader>
                <CardContent>
                    {type === 'LINK' &&
                        link?.includes("twitter.com") ? (
                        <>
                            <blockquote
                                className="twitter-tweet"
                                data-lang="en"
                                data-theme="light"
                            >
                                <a href={link}></a>
                            </blockquote>
                            <Script
                                src="https://platform.twitter.com/widgets.js"
                                strategy="lazyOnload" 
                            />
                            
                        </>
                    ) : (
                        <div className="">
                            <Link href={link!} className="" target="_blank" rel="noopener noreferrer">
                                <span className="underline cursor-pointer">
                                    {link}
                                </span>
                            </Link>
                        </div>
                    )
                    }
                </CardContent>
                <CardFooter className="grid gap-2">
                    <div className="flex gap-2">
                        {tags && tags.map((tag: Tag) => {
                            return (
                                <div key={tag.id}>
                                    <Badge>#{tag.tag}</Badge>
                                </div>
                            )
                        })}
                    </div>
                    <p>Added on {new Date(createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    })}</p>
                </CardFooter>
            </Card>
        </>
    );
}

export default NotesCards;