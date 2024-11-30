"use client"

import {
    ChevronsUpDown,
    LogOut,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useTransition } from "react"
import { logoutAction } from "@/app/actions/auth-route/logout-route-action"
import Image from "next/image"
import { useTheme } from "next-themes"
import User from '../public/user.svg'
import UserWhite from '../public/user-white.svg';
import { useUserStore } from "@/stores"

export function NavUser() {
    const { theme } = useTheme()
    const { username } = useUserStore()
    const user = {
            name: "shadcn",
            email: "m@example.com",
            avatar: theme !== 'dark' ? User : UserWhite,
    }

    const [isPending, startTransition] = useTransition();
    const { isMobile } = useSidebar()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-6"
                        >
                            <Image width={20} height={20} src={user.avatar} alt="avatar" className={`rounded-lg ml-1 text-center `} />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{username}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem onClick={() => {
                            startTransition(() => {
                                logoutAction()
                            })
                        }}>
                            <LogOut />
                            {isPending ? 'Logging Out...' : 'Log out'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
