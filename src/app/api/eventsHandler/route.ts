import { searchAndFilterEvents } from "@/utils/actions/eventsActions";
import { NextResponse } from "next/server";
import { EventType, EventStatus } from "@prisma/client";
import { NextRequest } from "next/server"; // Import NextRequest for typing

export async function GET(request: NextRequest) {
  try {
    // Use request.nextUrl to get the dynamic URL in a Next.js-compliant way
    const url = request.nextUrl;
    const searchTerm = url.searchParams.get("searchTerm") || "";

    // Convert eventType and status from string to the correct enum if they exist
    const eventType = url.searchParams.get("eventType") as
      | EventType
      | undefined;
    const status = url.searchParams.get("status") as EventStatus | undefined;

    const isFeatured = url.searchParams.get("isFeatured") === "true";
    const minDate = url.searchParams.get("minDate");
    const maxDate = url.searchParams.get("maxDate");
    const minRating = url.searchParams.get("minRating")
      ? Number(url.searchParams.get("minRating"))
      : 0;

    // Construct the filters object with optional properties
    const filters = {
      eventType: eventType || undefined,
      status: status || undefined,
      isFeatured: isFeatured || undefined,
      minDate: minDate || undefined,
      maxDate: maxDate || undefined,
      minRating: minRating || undefined,
    };

    // Fetch events with the filters
    const events = await searchAndFilterEvents(searchTerm, filters);

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error filtering events:", error);
    return NextResponse.json(
      { error: "Failed to filter events" },
      { status: 500 }
    );
  }
}
