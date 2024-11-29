import { AuthPageForm } from "@/components/auth-form";
const LoginPage = () => {
    return (
        <div className="w-full flex flex-col">
        <AuthPageForm page="login"/>
        </div>
    );
}

export default LoginPage;