"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp, Copy, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Message = {
  text: string
  sender: string
  rating?: "up" | "down"
  modelId?: string
}

type ComparisonViewProps = {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  botASettings: any
  botBSettings: any
  apiKey: string
  baseUrl: string
  onSaveChat: () => void
}

export function ComparisonView({
  messages,
  setMessages,
  botASettings,
  botBSettings,
  apiKey,
  baseUrl,
  onSaveChat,
}: ComparisonViewProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [storedApiKey, setStoredApiKey] = useState(localStorage.getItem("openai_api_key") || "")
  const [storedOpenAiUrl, setStoredOpenAiUrl] = useState(
    localStorage.getItem("openai_url") || "https://api.openai.com/v1",
  )
  const [copied, setCopied] = useState<{ [key: number]: boolean }>({})

  const sendMessageToBothBots = async () => {
    if (!input.trim()) return

    // Add user message
    const updatedMessages = [...messages, { text: input, sender: "User" }]
    setMessages(updatedMessages)

    setIsLoading(true)

    // Use stored API key and URL if available, otherwise use props
    const effectiveApiKey = storedApiKey || apiKey
    const effectiveBaseUrl = storedOpenAiUrl || baseUrl

    try {
      // Send requests to both bots in parallel
      const [botAResponse, botBResponse] = await Promise.all([
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": effectiveApiKey,
          },
          body: JSON.stringify({
            message: input,
            botType: "Bot A",
            settings: botASettings,
            customUrl: effectiveBaseUrl,
          }),
        }),
        fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": effectiveApiKey,
          },
          body: JSON.stringify({
            message: input,
            botType: "Bot B",
            settings: botBSettings,
            customUrl: effectiveBaseUrl,
          }),
        }),
      ])

      if (!botAResponse.ok || !botBResponse.ok) {
        throw new Error("Failed to get response from one or both bots")
      }

      const botAData = await botAResponse.json()
      const botBData = await botBResponse.json()

      // Add bot responses
      setMessages([
        ...updatedMessages,
        { text: botAData.response, sender: "Bot A", modelId: botASettings.modelId },
        { text: botBData.response, sender: "Bot B", modelId: botBSettings.modelId },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      // Add error message
      setMessages([
        ...updatedMessages,
        { text: "Error: Failed to get response", sender: "Bot A" },
        { text: "Error: Failed to get response", sender: "Bot B" },
      ])
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [index]: true })
    setTimeout(() => {
      setCopied({ ...copied, [index]: false })
    }, 2000)
  }

  // Group messages by conversation
  const userMessages = messages.filter((msg) => msg.sender === "User")
  const botAMessages = messages.filter((msg) => msg.sender === "Bot A")
  const botBMessages = messages.filter((msg) => msg.sender === "Bot B")

  // Create conversation pairs
  const conversations = userMessages.map((userMsg, idx) => ({
    user: userMsg,
    botA: botAMessages[idx] || null,
    botB: botBMessages[idx] || null,
  }))

  return (
    <div className="flex flex-col h-[600px]">
      <Tabs defaultValue="side-by-side" className="mb-4">
        <TabsList>
          <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
          <TabsTrigger value="sequential">Sequential</TabsTrigger>
        </TabsList>

        <TabsContent value="side-by-side" className="flex-1">
          <div className="grid grid-cols-2 gap-4 h-[500px]">
            {/* Bot A Column */}
            <div className="border rounded-md p-4 overflow-y-auto">
              <div className="font-medium mb-2 sticky top-0 bg-background p-2 border-b">
                Bot A {botASettings.modelId && `(${botASettings.modelId})`}
              </div>
              {conversations.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">No messages yet</div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conv, idx) => (
                    <div key={`a-${idx}`} className="space-y-2">
                      <Card className="p-3 bg-muted">
                        <span className="font-medium">User</span>
                        <p className="mt-1 whitespace-pre-wrap">{conv.user.text}</p>
                      </Card>
                      {conv.botA && (
                        <Card className="p-3 bg-card">
                          <div className="flex justify-between">
                            <span className="font-medium">Bot A</span>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(conv.botA!.text, idx)}
                                className="h-6 w-6"
                              >
                                {copied[idx] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rateMessage(messages.indexOf(conv.botA!), "up")}
                                className={conv.botA!.rating === "up" ? "text-green-500 h-6 w-6" : "h-6 w-6"}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rateMessage(messages.indexOf(conv.botA!), "down")}
                                className={conv.botA!.rating === "down" ? "text-red-500 h-6 w-6" : "h-6 w-6"}
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">{conv.botA.text}</p>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bot B Column */}
            <div className="border rounded-md p-4 overflow-y-auto">
              <div className="font-medium mb-2 sticky top-0 bg-background p-2 border-b">
                Bot B {botBSettings.modelId && `(${botBSettings.modelId})`}
              </div>
              {conversations.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">No messages yet</div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conv, idx) => (
                    <div key={`b-${idx}`} className="space-y-2">
                      <Card className="p-3 bg-muted">
                        <span className="font-medium">User</span>
                        <p className="mt-1 whitespace-pre-wrap">{conv.user.text}</p>
                      </Card>
                      {conv.botB && (
                        <Card className="p-3 bg-card">
                          <div className="flex justify-between">
                            <span className="font-medium">Bot B</span>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(conv.botB!.text, idx + 100)}
                                className="h-6 w-6"
                              >
                                {copied[idx + 100] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rateMessage(messages.indexOf(conv.botB!), "up")}
                                className={conv.botB!.rating === "up" ? "text-green-500 h-6 w-6" : "h-6 w-6"}
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => rateMessage(messages.indexOf(conv.botB!), "down")}
                                className={conv.botB!.rating === "down" ? "text-red-500 h-6 w-6" : "h-6 w-6"}
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">{conv.botB.text}</p>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sequential" className="flex-1">
          <div className="border rounded-md p-4 h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No messages yet. Start a conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <Card key={index} className={`p-3 ${msg.sender === "User" ? "bg-muted" : "bg-card"}`}>
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {msg.sender} {msg.modelId && `(${msg.modelId})`}
                      </span>
                      {msg.sender !== "User" && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(msg.text, index + 200)}
                            className="h-6 w-6"
                          >
                            {copied[index + 200] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => rateMessage(index, "up")}
                            className={msg.rating === "up" ? "text-green-500 h-6 w-6" : "h-6 w-6"}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => rateMessage(index, "down")}
                            className={msg.rating === "down" ? "text-red-500 h-6 w-6" : "h-6 w-6"}
                          >
                            <ThumbsDown className="h-3 w-3" />
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
        </TabsContent>
      </Tabs>

      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message to send to both models..."
            className="flex-1 min-h-[80px]"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessageToBothBots()
              }
            }}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={sendMessageToBothBots} disabled={isLoading || !input.trim()} className="flex-1">
            {isLoading ? "Generating responses..." : "Compare Both Models"}
          </Button>
          <Button onClick={onSaveChat} variant="outline">
            Save Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
