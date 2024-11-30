"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/stores"
import { FormFields } from "./form-fields"
import ShareBrainModel from "./share-brain-model"

export function AddContentDialog() {
  const { isOpen, onClose, isShareBrainModel } = useDialogStore()
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl mx-auto ">
        {isShareBrainModel ?
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Share Your Second Brain</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 justify-center">
              <ShareBrainModel />
            </div>
          </>
          :
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Add Content</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 justify-center">
              <FormFields />
            </div>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}
