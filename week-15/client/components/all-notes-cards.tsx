"use client"
import { ContentsProp, Tag } from "@/app/page";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FileText, LinkIcon, Share2Icon, Type, Youtube } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import Script from "next/script";
import { AlertDialogDelete } from "./delete-alert-dialog";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Image as Img } from 'lucide-react';
import XIcon from "@/components/x-icon";
const NotesCards = ({ link, title, type, createdAt, tags, id }: ContentsProp) => {
    console.log(link?.split('v=')[1]?.split('&')[0], 'link', link)
    const extractVideoId = (url: string) => {
        const regExp = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/.+\?v=))([\w-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const videoId = link && extractVideoId(link);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

    const [showIframe, setShowIframe] = useState(false);
    const params = useParams()
    const getTypeIcon = (type: string,link:string) => {
        switch (type) {
            case 'IMAGE':
                return <Img className="w-4 h-4" />
            case 'ARTICLE':
                return <FileText className="w-4 h-4" />
            case 'LINK':
                return (link.includes('twitter.com') || link.includes('x.com')) ? <XIcon size={16}/>:(link.includes('youtube.com')) ? <Youtube className="w-4 h-4"/> : <LinkIcon className="w-4 h-4" />
            default:
                return <Type className="w-4 h-4" />
        }
    }
    return (
        <>
            <Card className="w-[350px]  mt-10 min-h-64 relative">
                <CardHeader className="flex justify-between flex-row">
                    <CardTitle className="flex gap-2 justify-center items-center"><span>{getTypeIcon(type,thumbnailUrl ? thumbnailUrl: link!)}</span>{title}</CardTitle>
                    {!params.sharelink && <div className="flex gap-4">
                        <Share2Icon cursor={"pointer"} />
                        <AlertDialogDelete id={id} />
                    </div>}
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
                    ) : (videoId ? (
                        showIframe ? (
                            <iframe
                                width="320"
                                height="300"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        ) : (thumbnailUrl &&
                            <Image src={thumbnailUrl} alt="YouTube Thumbnail" width={500} height={500} onClick={() => setShowIframe(true)} style={{ cursor: 'pointer' }} title="Play" />
                        )
                    ) : type === 'IMAGE' ?
                        <>
                            <Image src={link!} width={400} height={400} alt="Image" />
                        </>
                        : (type === 'LINK' ? <div className="">
                            <Link href={link!} className="" target="_blank" rel="noopener noreferrer">
                                <span className="underline cursor-pointer">
                                    {link}
                                </span>
                            </Link>
                        </div>:
                            <div className="">
                                <span>{link}</span>
                            </div>
                        )
                    )
                    }
                </CardContent>
                <CardFooter className="grid gap-2">
                    <div className="flex gap-2 flex-wrap">
                        {tags && tags.map((tag: Tag) => {
                            return (
                                <div key={tag.id}>
                                    <Badge>#{tag?.title}</Badge>
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