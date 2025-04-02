import type { ConstructorParams } from "@browserbasehq/stagehand";
import { AISdkClient } from "./aisdk_client";
import { google } from "@ai-sdk/google";

const StagehandConfig: ConstructorParams = {
  verbose: 1 /* Verbosity level for logging: 0 = silent, 1 = info, 2 = all */,
  // domSettleTimeoutMs: 30_000 /* Timeout for DOM to settle in milliseconds */,

  // LLM configuration

  // llmClient: new AISdkClient({
  //   model: openai("gpt-4o-mini"),
  // }),

  llmClient: new AISdkClient({
    model: google("gemini-1.5-flash"),
  }),

  // Browser configuration
  env:
    process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
      ? "BROWSERBASE"
      : "LOCAL" /* Environment to run in: LOCAL or BROWSERBASE */,
  apiKey: process.env.BROWSERBASE_API_KEY /* API key for authentication */,
  projectId: process.env.BROWSERBASE_PROJECT_ID /* Project identifier */,
  browserbaseSessionID:
    undefined /* Session ID for resuming Browserbase sessions */,
  browserbaseSessionCreateParams: {
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    region: "ap-southeast-1",

    // browserSettings: {
    //   blockAds: true,
    //   viewport: {
    //     width: 1024,
    //     height: 768,
    //   },
    // },
  },

  localBrowserLaunchOptions: {
    viewport: {
      width: 1024,
      height: 768,
    },
  } /* Configuration options for the local browser */,
};

export default StagehandConfig;
