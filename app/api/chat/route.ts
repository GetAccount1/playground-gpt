import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { message, botType, settings, customUrl } = await request.json()

    // Get API key from environment or request
    const apiKey = process.env.OPENAI_API_KEY || request.headers.get("x-api-key")

    // Get OpenAI URL from environment or request
    const openAiUrl = process.env.OPENAI_URL || customUrl || "https://api.openai.com/v1"

    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 })
    }

    // Use the model ID from settings or default to gpt-3.5-turbo
    const modelId = settings.modelId || "gpt-3.5-turbo"

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai(modelId, {
        apiKey,
        baseURL: openAiUrl,
      }),
      prompt: message,
      temperature: settings.temperature,
      top_p: settings.topP,
    })

    return NextResponse.json({
      botType,
      response: text,
      modelId,
    })
  } catch (error: any) {
    console.error("Error in chat route:", error)
    return NextResponse.json({ error: error.message || "An error occurred" }, { status: 500 })
  }
}
