import { NextRequest, NextResponse } from "next/server";
import { AIModels } from "@/data/Constants";

export async function POST(req: NextRequest) {
  try {
    const { model, description, imageUrl } = await req.json();
    const ModelObj = AIModels.find((item) => item.name === model);
    const ModelName = ModelObj?.modelName || "google/gemini-2.0-flash-thinking-exp:free";


    // Send request to OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: ModelName,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: description,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        stream: true, 
      }),
    });

    // If response is not okay, return an error
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from OpenRouter" }, { status: response.status });
    }

    // Create a readable stream to send chunks of data in real-time
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
