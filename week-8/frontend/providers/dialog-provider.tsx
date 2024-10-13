"use client"
import AddCourseDialog from "@/components/add-course-dialog";
import { LoginAdminUserDialog } from "@/components/login-admin-user-dialog";
import { SignInDialog } from "@/components/signin-dialog";
import { useMountedState } from 'react-use'
const DialogProvider = () => {
    const isMounted = useMountedState();

    if (!isMounted) return null
    return (
        <>
            <AddCourseDialog />
            <LoginAdminUserDialog />
            <SignInDialog />
        </>
    )
}

export default DialogProvider