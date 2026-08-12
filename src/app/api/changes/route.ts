// MongoDB Change Streams are not available in PostgreSQL.
// This route is temporarily stubbed during the Postgres migration.
// TODO: Reimplement using PostgreSQL LISTEN/NOTIFY or a polling endpoint.
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  void _req;
  return NextResponse.json(
    {
      message:
        "Real-time change stream not yet implemented for PostgreSQL. Coming soon.",
    },
    { status: 501 }
  );
}
