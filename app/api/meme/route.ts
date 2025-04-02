// app/api/meme/route.ts
import { NextRequest, NextResponse } from "next/server";
import StagehandConfig from "../../stagehand/stagehand.config";
import { main } from "../../stagehand/main";
import { Stagehand } from "@browserbasehq/stagehand";

// Explicitly set the runtime to Node.js
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body properly for NextRequest
    const body = await req.json();
    const { sessionId } = body;

    // Create a Stagehand instance with your configuration
    const stagehand = new Stagehand({
      ...StagehandConfig,
      browserbaseSessionID: sessionId,
    });

    // Initialize Stagehand
    await stagehand.init();
    const { page } = stagehand;

    // Run your main function
    const imageUrl = await main({ page, stagehand });

    // Close the browser
    await stagehand.close();

    // Return the response
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating meme:", error);
    return NextResponse.json(
      { error: `Failed to generate meme: ${error}` },
      { status: 500 }
    );
  }
}
