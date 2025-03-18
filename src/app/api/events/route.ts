import { NextResponse } from "next/server";
import { EventStatus, Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { LIMIT } from "@/constants/values";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = auth();
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search") ?? "";
    const type = searchParams.get("type") ?? "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const ratingFrom = searchParams.get("ratingFrom");
    const status = searchParams.get("status") as EventStatus | undefined;
    const isFeatured = searchParams.get("isFeatured") === "true";
    const clerkId = searchParams.get("clerkId");

    let where: Prisma.EventWhereInput = {};

    if (search) where.eventName = { contains: search, mode: "insensitive" };
    if (type) where.type = type as Prisma.EnumEventTypeFilter<"Event">;
    if (minPrice) where.eventTicketPrice = { gte: parseFloat(minPrice) };
    if (maxPrice) {
      where.eventTicketPrice = {
        // @ts-ignore
        ...where.eventTicketPrice,
        lte: parseFloat(maxPrice),
      };
    }
    if (dateFrom) {
      where.dateStart = { gte: new Date(dateFrom) };
    }
    if (dateTo) {
      where.dateEnd = { lte: new Date(dateTo) };
    }
    if (isFeatured) {
      where.featured = true;
    }
    if (status) {
      where.status = status;
    }
    if (ratingFrom) {
      where.rating = { gte: parseInt(ratingFrom) };
    }

    if (clerkId && clerkId === user.userId) {
      where.clerkId = clerkId;
    } else if (!clerkId) {
      where = {
        ...where,
        NOT: {
          ...where.NOT,
          status: { in: ["NOT_CONFIRMED", "ENDED"] },
        },
      };
    } else if (clerkId && clerkId !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const events = await prisma.event.findMany({
      where,
      take: LIMIT,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { dateStart: "desc" },
    });

    return NextResponse.json(
      {
        events,
        nextId: events.length === LIMIT ? events[events.length - 1].id : null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
