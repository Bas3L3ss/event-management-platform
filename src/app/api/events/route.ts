import { getEventsPaginated } from "@/utils/actions/eventsActions";
import { NextResponse } from "next/server";
import { EventType, EventStatus } from "@prisma/client";
import { NextRequest } from "next/server";
import { LIMIT } from "@/constants/values";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const searchTerm = url.searchParams.get("searchTerm") || "";
    const offset = url.searchParams.get("offset") || "";
    const isNonFilter = url.searchParams.get("isNonFilter") || "";
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

    const filters = {
      eventType: eventType || undefined,
      status: status || undefined,
      isFeatured: isFeatured || undefined,
      minDate: minDate || undefined,
      maxDate: maxDate || undefined,
      minRating: minRating || undefined,
    };

    // Fetch events with the filters
    const events = await getEventsPaginated(
      parseInt(offset),
      LIMIT,
      searchTerm,
      isNonFilter == "false" ? filters : undefined
    );

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error filtering events:", error);
    return NextResponse.json(
      { error: "Failed to filter events" },
      { status: 500 }
    );
  }
}
