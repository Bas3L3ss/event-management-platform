// EventActions.ts

import { Event, EventStatus } from "@prisma/client";
import prisma from "../db";

export async function getLatestFeaturedEvent(amount: number = 2) {
  try {
    const latestEvent = await prisma.event.findMany({
      where: {
        featured: true,
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
        },
      },
      orderBy: {
        dateStart: "asc", // Fetch the event with the earliest start date
      },
      take: amount,
      skip: 1,
    });

    return latestEvent;
  } catch (error) {
    console.error("Error fetching the latest featured event:", error);
    throw new Error("Unable to fetch the latest featured event");
  } finally {
    await prisma.$disconnect();
  }
}
export async function getOneLatestFeaturedEvent() {
  try {
    const latestEvent = await prisma.event.findFirst({
      where: {
        featured: true,
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
        },
      },
      orderBy: {
        dateStart: "asc", // Fetch the event with the earliest start date
      },
    });

    return latestEvent;
  } catch (error) {
    console.error("Error fetching the latest featured event:", error);
    throw new Error("Unable to fetch the latest featured event");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getCommentsLength(eventId: string): Promise<number> {
  try {
    const commentsCount = await prisma.comment.count({
      where: {
        eventId: eventId,
      },
    });
    return commentsCount;
  } catch (error) {
    console.error("Error fetching comments count:", error);
    return 0; // Return 0 if there's an error
  }
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        dateStart: "asc", // Optionally, order by start date or any other field
      },
    });
    return events;
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Unable to fetch all events");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserIdByClerkId(
  clerkId: string
): Promise<string | null> {
  try {
    // Find the user by clerkId
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
      select: {
        id: true, // Select only the id field
      },
    });

    // Return the user ID if found, or null if not found
    return user ? user.id : null;
  } catch (error) {
    console.error("Error fetching user ID by clerkId:", error);
    throw new Error("Unable to fetch user ID by clerkId");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id, // Assuming the field name for the event ID is `id`
      },
    });
    return event;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw new Error("Unable to fetch event by ID");
  } finally {
    await prisma.$disconnect();
  }
}
