import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, Settings, PlusCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">AI Chat Playground</h1>
      <p className="text-xl text-muted-foreground mb-10">
        Compare responses from different AI models with customizable settings
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Chat
            </CardTitle>
            <CardDescription>Start a new conversation with AI models</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create a new chat session and compare responses from different AI models with custom parameters.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/chat/new">Start New Chat</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Saved Chats
            </CardTitle>
            <CardDescription>Access your previous conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>View and continue your saved chat sessions with AI models.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/chat">View Saved Chats</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Configure your AI models</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Customize API endpoints, model parameters, and other settings.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/settings">Open Settings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
