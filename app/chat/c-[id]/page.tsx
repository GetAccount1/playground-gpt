"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ComparisonView } from "@/components/comparison-view"
import { BotSettings } from "@/components/bot-settings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ChatData = {
  messages: any[]
  botASettings: {
    temperature: number
    topK: number
    topP: number
    modelId: string
  }
  botBSettings: {
    temperature: number
    topK: number
    topP: number
    modelId: string
  }
  createdAt?: string
  name?: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string

  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [messages, setMessages] = useState([])
  const [botASettings, setBotASettings] = useState({
    temperature: 0.7,
    topK: 50,
    topP: 0.9,
    modelId: "gpt-3.5-turbo",
  })
  const [botBSettings, setBotBSettings] = useState({
    temperature: 0.7,
    topK: 50,
    topP: 0.9,
    modelId: "gpt-4",
  })
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [chatName, setChatName] = useState("")

  useEffect(() => {
    // Load API key and URL from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key") || ""
    const savedOpenAiUrl = localStorage.getItem("openai_url") || "https://api.openai.com/v1"

    setApiKey(savedApiKey)
    setBaseUrl(savedOpenAiUrl)

    // Load chat data from localStorage
    const storedChatData = localStorage.getItem(`chat-${chatId.replace("c-", "")}`)

    if (storedChatData) {
      const parsedData = JSON.parse(storedChatData) as ChatData
      setChatData(parsedData)
      setMessages(parsedData.messages || [])

      // Handle potential missing modelId in older saved chats
      const botAWithModel = {
        ...parsedData.botASettings,
        modelId: parsedData.botASettings.modelId || "gpt-3.5-turbo",
      }

      const botBWithModel = {
        ...parsedData.botBSettings,
        modelId: parsedData.botBSettings.modelId || "gpt-4",
      }

      setBotASettings(botAWithModel)
      setBotBSettings(botBWithModel)
      setChatName(parsedData.name || `Chat ${chatId.replace("c-", "")}`)
    } else {
      // Chat not found, redirect to saved chats
      router.push("/chat")
    }

    setIsLoading(false)
  }, [chatId, router])

  const updateChat = () => {
    if (!chatData) return

    // Update chat name in the saved chats list
    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    const updatedChats = savedChats.map((chat: any) => {
      if (chat.id === chatId.replace("c-", "")) {
        return {
          ...chat,
          name: chatName,
        }
      }
      return chat
    })
    localStorage.setItem("savedChats", JSON.stringify(updatedChats))

    const updatedChatData = {
      ...chatData,
      messages,
      botASettings,
      botBSettings,
      name: chatName,
    }

    localStorage.setItem(`chat-${chatId.replace("c-", "")}`, JSON.stringify(updatedChatData))
  }

  if (isLoading) {
    return <div className="container mx-auto py-10 text-center">Loading chat...</div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Chat {chatId}</CardTitle>
              <CardDescription>Continued conversation</CardDescription>
            </div>
            <div className="w-full md:w-1/3 flex gap-2">
              <div className="flex-1">
                <Label htmlFor="chat-name">Chat Name</Label>
                <Input
                  id="chat-name"
                  value={chatName}
                  onChange={(e) => {
                    setChatName(e.target.value)
                    setTimeout(updateChat, 500)
                  }}
                  placeholder="Enter a name for this chat"
                />
              </div>
              <Button variant="outline" className="mt-auto" onClick={() => router.push("/chat")}>
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <ComparisonView
                messages={messages}
                setMessages={(newMessages) => {
                  setMessages(newMessages)
                  // Auto-save when messages change
                  setTimeout(updateChat, 500)
                }}
                botASettings={botASettings}
                botBSettings={botBSettings}
                apiKey={apiKey}
                baseUrl={baseUrl}
                onSaveChat={updateChat}
              />
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <BotSettings
                  title="Bot A Settings"
                  settings={botASettings}
                  setSettings={(newSettings) => {
                    setBotASettings(newSettings)
                    setTimeout(updateChat, 500)
                  }}
                />
                <BotSettings
                  title="Bot B Settings"
                  settings={botBSettings}
                  setSettings={(newSettings) => {
                    setBotBSettings(newSettings)
                    setTimeout(updateChat, 500)
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
