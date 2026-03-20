/**
 * API Debug Endpoint
 * Test this endpoint to see detailed error information
 * 
 * Calls: http://localhost:3000/api/debug
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const status = {
    timestamp: new Date().toISOString(),
    environment: {
      groq_api_key_set: !!process.env.GROQ_API_KEY,
      groq_api_key_prefix: process.env.GROQ_API_KEY?.substring(0, 10) + "...",
      convex_url_set: !!process.env.NEXT_PUBLIC_CONVEX_URL,
      arcjet_key_set: !!process.env.ARCJET_KEY,
      node_env: process.env.NODE_ENV,
    },
    endpoints: {
      groq: "https://api.groq.com/openai/v1/chat/completions",
      convex: process.env.NEXT_PUBLIC_CONVEX_URL,
    },
    message: "Check 'environment' and 'endpoints' fields above",
  };

  return NextResponse.json(status, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testType } = body;

    if (testType === "groq-key") {
      // Test if Groq API key is valid
      const apiKey = process.env.GROQ_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { error: "GROQ_API_KEY not set in environment" },
          { status: 500 }
        );
      }

      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant",
              messages: [{ role: "user", content: "Test" }],
              max_tokens: 10,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return NextResponse.json(
            {
              status: "GROQ_API_KEY_INVALID",
              error: data.error,
              action:
                "Regenerate API key from https://console.groq.com/keys",
            },
            { status: 400 }
          );
        }

        return NextResponse.json({ status: "GROQ_KEY_VALID", data });
      } catch (err) {
        return NextResponse.json(
          { status: "GROQ_CONNECTION_ERROR", error: err },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: 'Unknown testType. Try testType="groq-key"' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request", details: error },
      { status: 400 }
    );
  }
}
