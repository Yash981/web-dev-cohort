"use client"

import { PropsWithChildren } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export function ClientSidebar({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const protectedRoutes = (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/brain/'))
  return (
    <>
      {!protectedRoutes ?
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SidebarTrigger className="hover:bg-transparent" />
            {children}
          </SidebarInset>
        </SidebarProvider> :
        <>
          {children}
        </>
        }
    </>
  );
}