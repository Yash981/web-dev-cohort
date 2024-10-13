"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useGlobalStateManagement } from "../state-management/use-global-state";

export const LoginAdminUserDialog = () => {
    const { isOpen ,onClose,onLoginOpen,onLoginAsUser} = useGlobalStateManagement();
    return ( 
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-black" >
                <DialogHeader>
                    <DialogTitle className="text-white text-center">
                        Select How To Login
                    </DialogTitle>
                </DialogHeader>
                <div className="text-white text-center flex space-x-4 py-4">
                        <Button variant="outline" className="w-full h-20" onClick={()=>{
                            onClose();
                            onLoginOpen();
                            onLoginAsUser(true);
                    }}>
                                Student
                        </Button>
                        <Button  variant="outline" className="w-full h-20"
                        onClick={()=>{
                            onClose();
                            onLoginOpen()
                            onLoginAsUser(false);
                    }}
                        >
                                Instructor
                        </Button>
                </div>
            </DialogContent>
        </Dialog>
     );
}
 
