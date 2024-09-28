import { searchAndFilterUserSpecificEvents } from "@/utils/actions/eventsActions";
import { NextRequest, NextResponse } from "next/server";
import { EventType, EventStatus } from "@prisma/client"; // Import your enums
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Extract the query parameters from the request URL
    const url = request.nextUrl;
    const searchTerm = url.searchParams.get("searchTerm") || "";
    const clerkID = url.searchParams.get("clerkID") || "";

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

    // Construct the filters object
    const filters = {
      eventType: eventType || undefined, // Cast to EventType or undefined
      status: status || undefined, // Cast to EventStatus or undefined
      isFeatured: isFeatured || undefined,
      minDate: minDate || undefined,
      maxDate: maxDate || undefined,
      minRating: minRating || undefined,
    };

    // Fetch events with the filters
    const events = await searchAndFilterUserSpecificEvents(
      clerkID,
      searchTerm,
      filters
    );

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error filtering events:", error);

    return NextResponse.json({ error: "Failed to filter" }, { status: 500 });
  }
}
