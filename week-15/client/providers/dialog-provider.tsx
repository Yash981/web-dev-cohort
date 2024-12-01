"use client"
import { AddOrShareDialog } from "@/components/add-or-share-dialog";
import { useMounted } from "@/hooks/use-mounted";
const DialogProvider = () => {
    const isMounted = useMounted();

    if (!isMounted) return null
    return (
        <>
          <AddOrShareDialog/> 
        </>
    )
}

export default DialogProvider