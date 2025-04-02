import { NextResponse } from "next/server";
import Browserbase from "@browserbasehq/sdk";

export async function POST() {
  try {
    const client = new Browserbase({
      apiKey: process.env["BROWSERBASE_API_KEY"],
    });

    // List all active sessions
    const activeSessions = await client.sessions.list({
      status: "RUNNING",
    });

    // Close all active sessions
    for (const session of activeSessions) {
      await client.sessions.update(session.id, {
        status: "REQUEST_RELEASE",
        projectId: process.env["BROWSERBASE_PROJECT_ID"] || "",
      });

      console.log(`Session ${session.id} has been closed.`);
    }

    const session = await client.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      region: "ap-southeast-1",
      // timeout: 200,
    });

    const debugUrl = await client.sessions.debug(session.id);

    console.log(
      "Created session with debug URL:",
      debugUrl.debuggerFullscreenUrl
    );

    return NextResponse.json({
      sessionId: session.id,
      debugUrl: debugUrl.debuggerFullscreenUrl.replace(
        "https://www.browserbase.com/devtools-fullscreen/inspector.html",
        "https://www.browserbase.com/devtools-internal-compiled/index.html"
      ),
      region: "us-east-1",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
