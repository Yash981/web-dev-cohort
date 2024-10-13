"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGlobalStateManagement } from "../state-management/use-global-state";
import { FormFields } from "./form-fields";
import { Button } from "./ui/button";

export const SignInDialog = () => {
    const {  onLoginClose,isLoginOpen,SignInDialogToshow, onSignInDialogToshow,loginAsUser,onClose } = useGlobalStateManagement();
    

    return (
        <Dialog open={isLoginOpen} onOpenChange={
            ()=>{
                onLoginClose();
                onClose();
            }
        } >
            <DialogContent className="bg-black">
                <DialogHeader>
                    <DialogTitle className="text-white text-center">
                        {SignInDialogToshow ? `Sign in ${loginAsUser ? "as Student" : "as Instructor"}` : `Sign up ${loginAsUser ? "as Student" : "as Instructor"}`}
                    </DialogTitle>
                    <DialogDescription>
                        <div className="text-white text-center">
                            {SignInDialogToshow
                                ? "Don't have an account "
                                : "Already have an account"}{" "}
                            ?{" "}
                            <Button
                                variant="link"
                                onClick={() => onSignInDialogToshow(!SignInDialogToshow)}
                                className="text-white p-0 underline px-1"
                            >
                                {SignInDialogToshow ? "Sign up" : "Sign in"}
                            </Button>{" "}
                            {SignInDialogToshow
                                ? "to create a new account"
                                : "to your account"}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <FormFields SignInDialogToshow={SignInDialogToshow} />
            </DialogContent>
        </Dialog>
    );
};
