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
        <div className="flex justify-center items-center h-full">
        <Card className="flex justify-center items-center ">
            <CardHeader>
                <CardTitle>{currentPathname === '/login' ? 'Login Page': 'Signup Page'}</CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
        </div>
    );
}

export default AuthLayout;