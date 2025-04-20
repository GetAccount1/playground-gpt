"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, Settings, Home } from "lucide-react"

type SavedChat = {
  id: string
  name: string
  createdAt: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const [savedChats, setSavedChats] = useState<SavedChat[]>([])

  useEffect(() => {
    // Load saved chats from localStorage
    const loadedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    setSavedChats(loadedChats)
  }, [pathname]) // Reload when pathname changes to update the list

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-2 py-3">
          <MessageSquare className="h-6 w-6 mr-2" />
          <h2 className="text-lg font-semibold">Chat Playground</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/chat"}>
                  <Link href="/chat">
                    <MessageSquare className="h-4 w-4" />
                    <span>All Chats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/chat/new"}>
                  <Link href="/chat/new">
                    <PlusCircle className="h-4 w-4" />
                    <span>New Chat</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {savedChats.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {savedChats.slice(0, 5).map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild isActive={pathname === `/chat/c-${chat.id}`} tooltip={chat.name}>
                      <Link href={`/chat/c-${chat.id}`}>
                        <MessageSquare className="h-4 w-4" />
                        <span>{chat.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-4">
          <Button asChild className="w-full">
            <Link href="/chat/new">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Chat
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1">
          <div className="container p-4">
            <SidebarTrigger className="mb-4" />
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
