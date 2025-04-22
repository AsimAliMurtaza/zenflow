export const dynamic = "force-dynamic";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  await dbConnect();

  const changeStream = Task.watch([], { fullDocument: "updateLookup" });

  const encoder = new TextEncoder();

  changeStream.on("change", (change) => {
    writer.write(
      encoder.encode(`data: ${JSON.stringify(change.fullDocument)}\n\n`)
    );
  });

  req.signal.addEventListener("abort", () => {
    changeStream.close();
    writer.close();
  });

  // Set SSE headers
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
