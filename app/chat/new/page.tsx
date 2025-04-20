"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ComparisonView } from "@/components/comparison-view"
import { BotSettings } from "@/components/bot-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function NewChatPage() {
  const router = useRouter()
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
  const [chatName, setChatName] = useState("")

  useEffect(() => {
    // Load API key and URL from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key") || ""
    const savedOpenAiUrl = localStorage.getItem("openai_url") || "https://api.openai.com/v1"

    setApiKey(savedApiKey)
    setBaseUrl(savedOpenAiUrl)
  }, [])

  const saveChat = () => {
    const chatId = Date.now().toString()
    const name = chatName.trim() || `Chat ${chatId}`

    const chatData = {
      messages,
      botASettings,
      botBSettings,
      createdAt: new Date().toISOString(),
      name,
    }

    // Save chat data
    localStorage.setItem(`chat-${chatId}`, JSON.stringify(chatData))

    // Update saved chats list
    const savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]")
    const updatedChats = [
      ...savedChats,
      {
        id: chatId,
        name,
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("savedChats", JSON.stringify(updatedChats))

    // Navigate to the saved chat
    router.push(`/chat/c-${chatId}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>New Chat</CardTitle>
              <CardDescription>Compare responses from different AI models</CardDescription>
            </div>
            <div className="w-full md:w-1/3">
              <Label htmlFor="chat-name">Chat Name</Label>
              <Input
                id="chat-name"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Enter a name for this chat"
              />
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
                setMessages={setMessages}
                botASettings={botASettings}
                botBSettings={botBSettings}
                apiKey={apiKey}
                baseUrl={baseUrl}
                onSaveChat={saveChat}
              />
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <BotSettings title="Bot A Settings" settings={botASettings} setSettings={setBotASettings} />
                <BotSettings title="Bot B Settings" settings={botBSettings} setSettings={setBotBSettings} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
