import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/commits`,
      {
        headers: {
          "User-Agent": "release-hub-app"
        }
      }
    );

    return NextResponse.json(response.data.slice(0, 3));
  } catch (err: any) {
    return NextResponse.json(
      {
        source: "GITHUB",
        status: err.response?.status,
        message: err.response?.data || err.message
      },
      { status: 500 }
    );
  }
}
