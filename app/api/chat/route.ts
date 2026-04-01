import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface ChatRequest {
  message: string;
  userName?: string;
  userNickname?: string;
  personality?: "friendly" | "formal" | "energetic" | "calm";
  conversationHistory?: Array<{ role: string; content: string }>;
}

function getPersonalityInstructions(personality?: string): string {
  const instructions = {
    friendly:
      "Be warm, conversational, and use a casual friendly tone. Use friendly language and occasional emojis.",
    formal:
      "Be professional and use a formal tone. Maintain a business-like demeanor and use proper grammar.",
    energetic:
      "Be enthusiastic and lively. Use exclamation marks, energy, and excitement in your responses.",
    calm:
      "Be soft, balanced, and peaceful. Use gentle language and maintain a serene, composed tone.",
  };

  return (
    instructions[personality as keyof typeof instructions] ||
    instructions.friendly
  );
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body: ChatRequest = await request.json();
    const {
      message,
      userName = "User",
      userNickname,
      personality = "friendly",
      conversationHistory = [],
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const userGreeting =
      userNickname && userNickname !== userName
        ? `${userName} (${userNickname})`
        : userName;

    const systemPrompt = `You are a personalized AI desk bot assistant - the digital brain of a cute desk robot companion. 
You are helpful, knowledgeable, and friendly.
You are assisting ${userGreeting}.
${getPersonalityInstructions(personality)}

Important: 
- You are a desk companion, not a system control agent
- You provide information, conversation, and assistance
- You do NOT perform physical actions or system commands
- Keep responses concise and friendly (mostly under 200 words)
- Occasionally reference that you're a desk bot assistant when relevant`;

    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: messages,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content
    ) {
      return NextResponse.json(
        { error: "No response generated" },
        { status: 500 }
      );
    }

    const assistantMessage =
      data.candidates[0].content.parts[0]?.text ||
      "I couldn't generate a response.";

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
