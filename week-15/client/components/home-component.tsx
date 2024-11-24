"use client"
import { Plus, Share } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { useMounted } from "@/hooks/use-mounted";
import { useDialogStore } from "@/stores";

const HomeComponent = () => {
    const mounted = useMounted()
    const { onOpen } = useDialogStore()
    if (!mounted) return null;
    return (
        <div className="w-full">
            <div className="mt-10 flex justify-between">
                <h1 className="text-3xl  font-medium">All Notes</h1>
                <div className="flex gap-3 mr-2">
                    <ModeToggle />
                    <Button variant={"secondary"} className="rounded" onClick={()=>onOpen(true)}><Share /> Share Brain</Button>
                    <Button variant={"secondary"} className="rounded" onClick={()=>onOpen(false)}><Plus /> Add Content</Button>
                </div>
            </div>

        </div>
    );
}

export default HomeComponent;