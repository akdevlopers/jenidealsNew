import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let payload: any = {};

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      formData.forEach((value, key) => {
        payload[key] = value;
      });
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();

      formData.forEach((value, key) => {
        payload[key] = value;
      });
    }

    console.log("Received payload:", payload);

    const response = await fetch(
      "https://admin.jenideals.com/api/android/version4/viewProfile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    console.log("Laravel status:", response.status);
    console.log("Laravel response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        {
          status: false,
          message: "Laravel did not return valid JSON",
          response: responseText,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Homepage UAE API Error:", error);

    return NextResponse.json(
      {
        status: false,
        message: "Failed to fetch homepage data",
      },
      { status: 500 }
    );
  }
}