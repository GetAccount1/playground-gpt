"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [openAiUrl, setOpenAiUrl] = useState("")

  useEffect(() => {
    // Load settings from localStorage
    const savedApiKey = localStorage.getItem("openai_api_key") || ""
    const savedOpenAiUrl = localStorage.getItem("openai_url") || "https://api.openai.com/v1"

    setApiKey(savedApiKey)
    setOpenAiUrl(savedOpenAiUrl)
  }, [])

  const saveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem("openai_api_key", apiKey)
    localStorage.setItem("openai_url", openAiUrl)

    toast({
      title: "Settings saved",
      description: "Your API settings have been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure your OpenAI API settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
            />
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openAiUrl">OpenAI API URL</Label>
            <Input
              id="openAiUrl"
              type="text"
              value={openAiUrl}
              onChange={(e) => setOpenAiUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
            <p className="text-sm text-muted-foreground">Custom API endpoint for OpenAI or compatible services.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings}>Save Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
