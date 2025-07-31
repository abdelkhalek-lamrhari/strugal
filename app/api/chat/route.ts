// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log("Chat API route called")

    const { messages } = await req.json()
    console.log("Received messages:", messages)

    if (!process.env.MISTRAL_API_KEY) {
      console.error("MISTRAL_API_KEY is not set")
      return new Response("API key not configured", { status: 500 })
    }

    console.log("Using Mistral API key:", process.env.MISTRAL_API_KEY?.substring(0, 10) + "...")

    const systemMessage = {
      role: "system",
      content: `Tu es l'Assistant STRUGAL, un assistant IA utile pour le système de gestion d'inventaire STRUGAL. 
      
      Tu aides les utilisateurs avec :
      - Questions sur la gestion d'inventaire
      - Compréhension des produits en aluminium et en verre
      - Navigation et fonctionnalités du système
      - Support général pour le système d'inventaire STRUGAL
      
      Réponds TOUJOURS en français. Garde tes réponses concises, utiles et professionnelles. Maintiens toujours un ton amical.
      Si on te demande des données d'inventaire spécifiques, rappelle aux utilisateurs de vérifier le tableau de bord pour les informations en temps réel.`,
    }

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-large-latest",
        messages: [systemMessage, ...messages],
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Mistral API error:", response.status, errorText)
      throw new Error(`Mistral API error: ${response.status} ${errorText}`)
    }

    console.log("Mistral API call successful, streaming response")

    // Create a readable stream to handle the SSE response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        const reader = response.body?.getReader()

        if (!reader) {
          controller.error(new Error("No response body"))
          return
        }

        const decoder = new TextDecoder()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() || ""

            for (const line of lines) {
              const trimmed = line.trim()
              if (trimmed.startsWith("data: ")) {
                const data = trimmed.slice(6)

                if (data === "[DONE]") {
                  controller.close()
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ""

                  if (content) {
                    const streamData = `data: ${JSON.stringify({ content })}\n\n`
                    controller.enqueue(encoder.encode(streamData))
                  }
                } catch (e) {
                  console.error("Error parsing streaming data:", e)
                }
              }
            }
          }
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
