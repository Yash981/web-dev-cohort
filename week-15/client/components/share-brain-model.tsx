"use client"
import { Copy, Verified } from "lucide-react";
import { Button } from "./ui/button";
import { ShareBrainLink } from "@/actions/share-brain-action";
import { useState } from "react";

const ShareBrainModel = () => {
    const [isCopied,setIsCopied] = useState(false)
    const handleShareReq = async () =>{
        try {
            const response = await ShareBrainLink(true)
            navigator.clipboard.writeText(response.link).then(()=>{setIsCopied(true);setTimeout(()=>{setIsCopied(false)},2000)}).catch((err)=>{console.log("Error Copying the link",err)})
            return response
        } catch (error) {
            console.log("Error Creating a Link",error)
        }
    }
    return (
        <div className="text-center gap-2 flex flex-col">
            <p>Share your entire collection of notes, documents,
                tweets, and Images with others. They&apos;ll be able to
                mport your content into their own Second Brain.</p>
            <Button variant={"default"} onClick={handleShareReq}> {isCopied ? <Verified /> : <Copy />}
            <span style={{ marginLeft: "8px" }}>{isCopied ? "Copied to Clipboard" : 'Share Brain'}</span></Button>
        </div>
    );
}

export default ShareBrainModel;