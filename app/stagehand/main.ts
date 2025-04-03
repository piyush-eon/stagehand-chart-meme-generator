import { Page, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod";

export async function main({
  page,
  // context,
  stagehand,
  title,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  // context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
  title: string;
}) {
  console.log("Starting Chart Meme Generation...");

  await stagehand.page.goto("https://imgflip.com/chart-maker", {
    timeout: 0,
    waitUntil: "domcontentloaded",
  });

  try {
    console.log("Selecting Donut Chart Type...");
    await page.act({
      action:
        'Click the "Donut" chart type button with selector "div.cha-type[data-type="donut"]".',
    });

    await page.click('div.cha-type[data-type="donut"]');

    console.log("Setting Chart Title...");
    const titleres = await page.act({
      action: `Enter the text as "${title}" in the input box containing "Chart Title" placeholder`,
    });
    console.log(titleres);

    console.log("Generating and filling in captions...");
    const { response1, response2 } = await page.extract({
      instruction: `Based on the message "${title}", generate two short, humorous responses which will be used for a chart meme - Response 1 will be 1% of the activity and response 2 will be 99% of the activity based on "${title}"`,
      schema: z.object({
        response1: z.string(),
        response2: z.string(),
      }),
    });

    console.log(response1, response2);

    // Step 3: Act by filling in the observed input fields with the generated responses
    const [action1] = await page.observe(
      `Locate the input box with the placeholder "slice #1"`
    );
    const [action2] = await page.observe(
      `Locate the input box with the placeholder "slice #2"`
    );

    console.log(action1, action2);

    // If the actions look correct, you can then use them to fill in the responses
    await page.act({
      ...action1,
      arguments: [response2],
    });

    await page.act({
      ...action2,
      arguments: [response1],
    });

    console.log("Clicking 'Make Chart' button...");
    await page.act({
      action: 'Click the "Make Chart" button',
    });

    console.log("Waiting for the generated chart URL...");

    // Wait for the input field to appear
    await page.waitForSelector("input.img-code.link", { timeout: 10000 });

    const imageUrlTag = await page.locator("input.img-code.html").inputValue();

    console.log("Generated Chart URL: ", imageUrlTag);

    // Extract the direct image URL
    const imageUrlMatch = imageUrlTag.match(/src="([^"]+)"/);
    const directImageUrl = imageUrlMatch ? imageUrlMatch[1] : null;

    if (!directImageUrl) {
      console.error("Failed to extract image URL");
      return;
    }

    return directImageUrl;
  } catch (error) {
    console.error("Error during chart meme generation:", JSON.stringify(error));
    await stagehand.close();
    process.exit(1);
  }
}
