"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp } from "lucide-react"

type Message = {
  text: string
  sender: string
  rating?: "up" | "down"
}

type ChatInterfaceProps = {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  botASettings: any
  botBSettings: any
  apiKey: string
  baseUrl: string
  onSaveChat: () => void
}

export function ChatInterface({
  messages,
  setMessages,
  botASettings,
  botBSettings,
  apiKey,
  baseUrl,
  onSaveChat,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [storedApiKey, setStoredApiKey] = useState("")
  const [storedOpenAiUrl, setStoredOpenAiUrl] = useState("")

  useEffect(() => {
    // Load API key and URL from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key") || ""
    const savedOpenAiUrl = localStorage.getItem("openai_url") || "https://api.openai.com/v1"

    setStoredApiKey(savedApiKey)
    setStoredOpenAiUrl(savedOpenAiUrl)
  }, [])

  const sendMessage = async (botType: "Bot A" | "Bot B") => {
    if (!input.trim()) return

    const settings = botType === "Bot A" ? botASettings : botBSettings

    // Use stored API key and URL if available, otherwise use props
    const effectiveApiKey = storedApiKey || apiKey
    const effectiveBaseUrl = storedOpenAiUrl || baseUrl

    // Add user message
    const updatedMessages = [...messages, { text: input, sender: "User" }]
    setMessages(updatedMessages)

    setIsLoading(true)

    try {
      // Send request to API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": effectiveApiKey,
        },
        body: JSON.stringify({
          message: input,
          botType,
          settings,
          customUrl: effectiveBaseUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add bot response
      setMessages([...updatedMessages, { text: data.response, sender: botType }])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      setMessages([...updatedMessages, { text: "Error: Failed to get response", sender: botType }])
    } finally {
      setIsLoading(false)
      setInput("")
    }
  }

  const rateMessage = (index: number, rating: "up" | "down") => {
    const updatedMessages = [...messages]
    updatedMessages[index].rating = rating
    setMessages(updatedMessages)
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4 border rounded-md p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No messages yet. Start a conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <Card key={index} className={`p-3 ${msg.sender === "User" ? "bg-muted" : "bg-card"}`}>
                <div className="flex justify-between">
                  <span className="font-medium">{msg.sender}</span>
                  {msg.sender !== "User" && (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => rateMessage(index, "up")}
                        className={msg.rating === "up" ? "text-green-500" : ""}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => rateMessage(index, "down")}
                        className={msg.rating === "down" ? "text-red-500" : ""}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 border rounded-md"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage("Bot A")
              }
            }}
          />
          <Button onClick={() => sendMessage("Bot A")} disabled={isLoading || !input.trim()}>
            Send to Bot A
          </Button>
          <Button onClick={() => sendMessage("Bot B")} variant="secondary" disabled={isLoading || !input.trim()}>
            Send to Bot B
          </Button>
        </div>

        <Button onClick={onSaveChat} variant="outline">
          Save Chat
        </Button>
      </div>
    </div>
  )
}
