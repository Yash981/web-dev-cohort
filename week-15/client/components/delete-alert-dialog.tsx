"use client"
import { deleteContent } from "@/app/actions/delete-content-action"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"  
  export function AlertDialogDelete({id}:{id:string}) {
    const router = useRouter()
    const handleDelete = async () =>{
        if(id){
            try {
                const response = await deleteContent(id)
                console.log(response)
                router.refresh()
            } catch (error:any) {
                console.log("failed to delete",error)
            }
        } else{
            console.log("No ContentId provided to delete")
        }
    }
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Trash cursor={"pointer"} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              Content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-0 focus-visible:ring-offset-0">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  