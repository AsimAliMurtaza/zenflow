export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

    const response = await fetch(`${ollamaHost}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    // Create a transformer to parse NDJSON
    const stream = response.body
      ?.pipeThrough(new TextDecoderStream())
      .pipeThrough(new TransformStream({
        transform(chunk, controller) {
          try {
            // Split by newlines and parse each JSON object
            chunk.split('\n')
              .filter(line => line.trim() !== '')
              .forEach(line => {
                const parsed = JSON.parse(line);
                if (parsed.message?.content) {
                  controller.enqueue(parsed.message.content);
                }
              });
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
      }));

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Ollama error:', error);
    return new Response(JSON.stringify({ error: 'Error communicating with Ollama' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}