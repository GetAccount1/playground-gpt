"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type SavedChat = {
  id: string
  name: string
  createdAt: string
}

export default function SavedChatsPage() {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([])

  useEffect(() => {
    // Load saved chats from localStorage
    const loadedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    setSavedChats(loadedChats)
  }, [])

  const deleteChat = (chatId: string) => {
    // Remove chat from localStorage
    localStorage.removeItem(`chat-${chatId}`)

    // Update saved chats list
    const updatedChats = savedChats.filter((chat) => chat.id !== chatId)
    localStorage.setItem("savedChats", JSON.stringify(updatedChats))
    setSavedChats(updatedChats)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Saved Chats</CardTitle>
          <CardDescription>Access your previously saved conversations</CardDescription>
        </CardHeader>
        <CardContent>
          {savedChats.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No saved chats found</p>
              <Button asChild>
                <Link href="/chat/new">Start a New Chat</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedChats.map((chat) => (
                <Card key={chat.id} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{chat.name}</h3>
                      <p className="text-sm text-muted-foreground">{new Date(chat.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/chat/c-${chat.id}`}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Open
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this chat? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteChat(chat.id)}
                              className="bg-red-500 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
