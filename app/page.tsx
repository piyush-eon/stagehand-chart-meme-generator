"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [debugUrl, setDebugUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleGenerate = async () => {
    if (!title.trim()) return;

    setIsLoading(true);
    setProgress("Creating session...");

    try {
      // Create a session
      const sessionResponse = await fetch("/api/session", {
        method: "POST",
      });
      const sessionData = await sessionResponse.json();
      setDebugUrl(sessionData.debugUrl);

      setProgress("Generating your chart meme...");

      // Send the title to generate the meme
      const response = await fetch("/api/meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionData.sessionId,
          title: title,
        }),
      });

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating meme:", error);
    } finally {
      setIsLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-slate-800 dark:text-slate-100">
            Chart Meme Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Create hilarious chart memes in seconds!
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8">
          <div className="mb-6">
            <label className="block text-slate-700 dark:text-slate-300 text-lg font-medium mb-2">
              What&apos;s your chart about?
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. 'Me trying to study'"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !title.trim()}
                className="w-52 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? progress : "Generate Meme"}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter a title for your chart and we&apos;ll create a funny donut
              chart meme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {imageUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
                Your Chart Meme
              </h3>
              <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Generated Chart Meme"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="mt-4 flex gap-4">
                <a
                  href={imageUrl}
                  download="chart-meme.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Download
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(imageUrl);
                    alert("URL copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Copy URL
                </button>
              </div>
            </div>
          )}

          {debugUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-300">
                Watch Live Generation
              </h3>
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                <iframe
                  key={debugUrl}
                  src={debugUrl}
                  className="w-full h-96 pointer-events-none"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
                  referrerPolicy="no-referrer"
                  style={{ pointerEvents: "none" }}
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                See how we&apos;re creating your meme in real-time!
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-slate-500 dark:text-slate-400">
        <p>Created with ❤️ by RoadsideCoder</p>
      </footer>
    </div>
  );
}
