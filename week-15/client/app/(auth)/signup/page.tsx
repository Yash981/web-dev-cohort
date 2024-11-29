import { AuthPageForm } from "@/components/auth-form";

const SignUpPage = () => {
    return (
        <div className="w-full flex flex-col">
            <AuthPageForm page={'signup'}/>
        </div>
    );
}

export default SignUpPage;