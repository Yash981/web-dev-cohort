"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname } from "next/navigation";

type AuthLayoutProps = {
    children: React.ReactNode,
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const pathname =  usePathname(); 
    return (
        <div className="flex justify-center items-center h-screen w-full">
        <Card className="flex justify-center items-center min-w-96 min-h-96 flex-col gap-8">
            <CardHeader className="">
                <CardTitle>{pathname === '/login' ? 'Login Page': 'Signup Page'}</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                {children}
            </CardContent>
        </Card>
        </div>
    );
}

export default AuthLayout;