"use client"
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useGlobalStateManagement } from "../state-management/use-global-state";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
const Header = () => {
    const { onOpen, userNickName } = useGlobalStateManagement();
    
    const handleSignInClick = () => {
        // console.log('Sign in button clicked');
        onOpen();
    };
    return (
        <header className="w-full h-[80px] sticky top-0 text-white flex items-center justify-between px-6 border-b border-gray-800 backdrop-blur-lg shadow-lg">
            <div className="flex items-center">
                <Image src="/logo.svg" alt="logo" width={80} height={80} className="invert" priority />
            </div>

            <div className="flex items-center gap-4">
                <Input
                    className="w-64 p-2 bg-transparent border-2 border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    placeholder="Search..."
                    type="search"
                />
                {!localStorage.getItem('course_selling_token') ?
                    <Button
                        className="px-4 py-2 border border-gray-700  rounded-md hover:bg-white hover:text-black transition-colors bg-white text-black"
                        variant="default"
                        onClick={handleSignInClick}
                    >
                        Sign in / Sign up
                    </Button> :
                    <TooltipProvider>
                        <Tooltip >
                            <TooltipTrigger asChild>
                                <Button className="px-4 py-2 border border-gray-700   hover:bg-white hover:text-black transition-colors bg-white text-black rounded-full" variant="default" asChild>
                                    <Avatar >
                                        <AvatarFallback className="text-black">{userNickName.split(' ')[0][0]}{userNickName.split(' ')[1][0]}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{userNickName}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                }
            </div>
        </header>
    );
}

export default Header;
