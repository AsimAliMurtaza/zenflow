import axios from "axios";

const GEMINI_API_URL = process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateGeminiContent(prompt: string): Promise<string> {
  return generateGeminiRAGResponse([{ role: "user", content: prompt }], "No workspace context required.");
}

export async function generateGeminiRAGResponse(
  messages: ChatMessage[],
  workspaceContext: string
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
    }

    const systemInstruction = `You are ZenFlow AI, an intelligent workspace copilot for ZenFlow project management software.
You have real-time access to the current user's workspace data provided below in JSON format.

WORKSPACE CONTEXT:
\`\`\`json
${workspaceContext}
\`\`\`

INSTRUCTIONS:
1. Answer the user's questions concisely, accurately, and professionally based on the WORKSPACE CONTEXT above.
2. Use markdown formatting (lists, bold text, code blocks, status pills) to format project, task, and team information nicely.
3. If asked about tasks, projects, due dates, or teams, refer directly to the exact data in the WORKSPACE CONTEXT.
4. If a task or project is overdue (due date before systemTime) or has high priority, highlight it clearly.
5. If requested information is not in the user's workspace context, politely inform the user that it was not found in their accessible workspace.`;

    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: contents,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data as {
      candidates?: { content?: { parts?: { text: string }[] } }[];
    };

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || "No response generated.";
  } catch (error) {
    console.error("Gemini RAG API Error:", error);
    return "I ran into an error generating a response. Please check your Gemini API key configuration.";
  }
}