
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
// Menu items.
const items = [
  {
    title: "Tweets",
    url: "#",
    icon: Twitter
  },
  {
    title: "Videos",
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
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel title="brain">Second Brain</SidebarGroupLabel>
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
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>

    </Sidebar>
  )
}
