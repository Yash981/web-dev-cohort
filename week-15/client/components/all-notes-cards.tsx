import { ContentsProp, Tag } from "@/app/page";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  
import { Share2Icon, Trash2Icon } from "lucide-react";
import { Badge } from "./ui/badge";
const NotesCards = ({link,title,type,createdAt,tags}:ContentsProp) => {
    return (
        <>
            <Card className="w-[350px]  mt-10">
                <CardHeader className="flex justify-between flex-row">
                    <CardTitle>{title}</CardTitle>
                    <div className="flex gap-4">
                        <Share2Icon cursor={"pointer"}/>
                        <Trash2Icon cursor={"pointer"}/>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{link}</p>
                    <p>{type}</p>
                </CardContent>
                <CardFooter className="grid gap-2">
                    <div className="flex gap-2">
                    {tags && tags.map((tag:Tag)=>{
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