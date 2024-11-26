import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { headers } from "next/headers";

type AuthLayoutProps = {
    children: React.ReactNode,
}

const AuthLayout = async ({ children }: AuthLayoutProps) => {
    const headersList = await headers(); // Access headers
    console.log(headersList)
    const referer = headersList.get('referer') || ''
    let currentPathname = ""
    if(referer) currentPathname = new URL(referer).pathname
    return (
        <div className="flex justify-center items-center h-screen w-full">
        <Card className="flex justify-center items-center min-w-96 min-h-96 flex-col gap-8">
            <CardHeader className="">
                <CardTitle>{currentPathname === '/login' ? 'Login Page': 'Signup Page'}</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
                {children}
            </CardContent>
        </Card>
        </div>
    );
}

export default AuthLayout;