"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/stores"
import { FormFields } from "./form-fields"

export function AddContentDialog() {
  const { isOpen,onClose } = useDialogStore()
  console.log(isOpen,'isopne')
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Add Content</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2 justify-center">
            <FormFields/>
        </div>
      </DialogContent>
    </Dialog>
  )
}
