"use client"
import { File, Hash, Link as IconLink, Search, Twitter,  Youtube } from "lucide-react"

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
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
// Menu items.
const items = [
  {
    title: "Tweets",
    url: "#",
    icon: Twitter
  },
  {
    title: "Youtube",
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
    icon: IconLink,
  },
  {
    title: "Tags",
    url: "#",
    icon: Hash,
  },{
    title:"Quick Search",
    url:"/quick-search",
    icon: Search
  }
]


export function AppSidebar() {
  const {username} = useUserStore()
  const params = useParams()
  const router = useRouter()
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel title="brain" className="text-3xl mb-5 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent cursor-pointer" onClick={()=>{
            router.refresh();
            router.push('/');
            }}>Second Brain</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} key={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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
