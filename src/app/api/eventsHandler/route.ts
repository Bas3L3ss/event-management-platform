import { searchAndFilterEvents } from "@/utils/actions/eventsActions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("running");
    const body = await request.json();
    const { searchTerm, filters } = body; // Get search query and filters from the request body

    const events = await searchAndFilterEvents(searchTerm, filters);
    console.log(events);

    return NextResponse.json(events, { status: 201 });
  } catch (error) {
    console.error("Error filtering events:", error);

    return NextResponse.json({ error: "Failed to filter" }, { status: 500 });
  }
}
