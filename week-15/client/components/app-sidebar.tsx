"use client"
import { File, Hash, Link, Twitter,  Youtube } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useUserStore } from "@/stores"
import { useParams } from "next/navigation"
// Menu items.
const items = [
  {
    title: "Tweets",
    url: "#",
    icon: Twitter
  },
  {
    title: "Images",
    url: "#",
    icon: Youtube,
  },
  {
    title: "Documents",
    url: "#",
    icon: File,
  },
  {
    title: "Links",
    url: "#",
    icon: Link,
  },
  {
    title: "Tags",
    url: "#",
    icon: Hash,
  },
]


export function AppSidebar() {
  const {username} = useUserStore()
  const params = useParams()
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel title="brain" className="text-3xl mb-5 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Second Brain</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {username && !params.sharelink && <SidebarFooter>
        <NavUser/>
      </SidebarFooter>}

    </Sidebar>
  )
}
