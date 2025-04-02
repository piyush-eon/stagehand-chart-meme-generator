"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [debugUrl, setDebugUrl] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const sessionResponse = await fetch("/api/session", {
        method: "POST",
      });
      const sessionData = await sessionResponse.json();
      setDebugUrl(sessionData.debugUrl);

      const response = await fetch("/api/meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionData.sessionId }),
      });

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating meme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1>Meme Generator</h1>
      <input
        type="text"
        placeholder="Enter meme title"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2"
      />
      <button
        onClick={handleGenerate}
        className="ml-2 p-2 bg-blue-500 text-white"
      >
        {isLoading ? "Generating..." : "Generate Meme"}
      </button>

      {imageUrl && (
        <div className="mt-4">
          <h3>Generated Meme:</h3>
          <Image
            src={imageUrl}
            alt="Generated Chart Meme"
            width={500}
            height={500}
            className="rounded-lg border border-gray-200"
            unoptimized
          />
          <div className="mt-2">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Download Image
            </a>
          </div>
        </div>
      )}

      {debugUrl && (
        <iframe
          key={debugUrl}
          src={debugUrl}
          className="w-full h-96 pointer-events-none"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          referrerPolicy="no-referrer"
          style={{ pointerEvents: "none" }}
          loading="lazy"
        />
      )}
    </div>
  );
}
