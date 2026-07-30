import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/authHelpers";
import { buildUserWorkspaceContext } from "@/lib/ragEngine";
import { generateGeminiRAGResponse, ChatMessage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const prompt = body.prompt;
    const history: ChatMessage[] = body.messages || [];

    // Formulate messages array
    const messages: ChatMessage[] = history.length > 0
      ? history
      : prompt
      ? [{ role: "user", content: prompt }]
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "No prompt or messages provided" },
        { status: 400 }
      );
    }

    // 1. Build live workspace RAG context for this user
    const workspaceContext = await buildUserWorkspaceContext(userId);

    // 2. Generate Gemini response with context & history
    const response = await generateGeminiRAGResponse(messages, workspaceContext);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Gemini API Route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}