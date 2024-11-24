import { Copy } from "lucide-react";
import { Button } from "./ui/button";

const ShareBrainModel = () => {
    return (
        <div className="text-center gap-2 flex flex-col">
            <p>Share your entire collection of notes, documents,
                tweets, and videos with others. They&apos;ll be able to
                mport your content into their own Second Brain.</p>
            <Button variant={"default"}> <Copy/>Share Brain</Button>
        </div>
    );
}

export default ShareBrainModel;