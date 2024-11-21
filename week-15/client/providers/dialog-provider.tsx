"use client"
import { AddContentDialog } from "@/components/add-content-dialog";
import { useMounted } from "@/hooks/use-mounted";
const DialogProvider = () => {
    const isMounted = useMounted();

    if (!isMounted) return null
    return (
        <>
          <AddContentDialog/> 
        </>
    )
}

export default DialogProvider