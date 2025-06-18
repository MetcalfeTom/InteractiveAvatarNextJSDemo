const NEXT_PUBLIC_HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

export async function POST() {
  try {
    console.log("Starting token request...");
    
    // Check for required environment variables
    if (!NEXT_PUBLIC_HEYGEN_API_KEY) {
      console.error("NEXT_PUBLIC_HEYGEN_API_KEY is missing from environment variables");
      throw new Error("API key is missing from .env");
    }
    
    const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    if (!baseApiUrl) {
      console.error("NEXT_PUBLIC_BASE_API_URL is missing from environment variables");
      throw new Error("Base API URL is missing from .env");
    }

    console.log("Environment variables loaded successfully");
    console.log("Base API URL:", baseApiUrl);
    
    const apiUrl = `${baseApiUrl}/v1/streaming.create_token`;
    console.log("Making request to:", apiUrl);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-api-key": NEXT_PUBLIC_HEYGEN_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", res.status);
    console.log("Response headers:", Object.fromEntries(res.headers.entries()));

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API request failed:", {
        status: res.status,
        statusText: res.statusText,
        body: errorText,
      });
      throw new Error(`API request failed with status ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log("Response data:", data);

    // Check if the expected token structure exists
    if (!data?.data?.token) {
      console.error("Invalid response structure:", data);
      throw new Error("Invalid response structure - token not found");
    }

    console.log("Token retrieved successfully");
    return new Response(data.data.token, {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving access token:", error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return new Response(`Failed to retrieve access token: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 500,
    });
  }
}
