import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      "https://admin.jenideals.com/api/android/version4/homepage-uae",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch homepage data",
      },
      { status: 500 }
    );
  }
}