// EventActions.ts

import { Comment, Event, EventStatus, EventType } from "@prisma/client";
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
        id,
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

// actions/eventActions.ts (or any actions file)

export async function searchAndFilterEvents(
  searchTerm: string,
  filters: {
    eventType?: EventType;
    status?: EventStatus;
    isFeatured?: boolean;
    minDate?: string;
    maxDate?: string;
    minRating?: number;
  }
) {
  try {
    const events = await prisma.event.findMany({
      where: {
        eventName: {
          contains: searchTerm, // Fuzzy search on event name
          mode: "insensitive", // Case-insensitive search
        },
        type: filters.eventType ? filters.eventType : undefined,
        status: filters.status ? filters.status : undefined,
        featured: filters.isFeatured ? filters.isFeatured : undefined,
        dateStart: filters.minDate
          ? {
              gte: new Date(filters.minDate),
            }
          : undefined,
        dateEnd: filters.maxDate
          ? {
              lte: new Date(filters.maxDate),
            }
          : undefined,
        rating: {
          gte: filters.minRating || 0,
        },
      },
      orderBy: {
        dateStart: "asc", // Order by start date
      },
    });

    return events;
  } catch (error) {
    console.error("Error searching and filtering events:", error);
    throw new Error("Unable to fetch events");
  }
}

export const getUserLengthByClerkId = async (clerkId: string) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        clerkId,
      },
    });

    return events.length;
  } catch (error) {
    console.error("Error getting events:", error);
    throw new Error("Unable to fetch events");
  }
};

export async function getCommentsByEventId(
  eventId: string
): Promise<Comment[]> {
  try {
    const comments = await prisma.comment.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
    });
    return comments;
  } catch (error) {
    console.error(
      `Error fetching comments for event with id ${eventId}:`,
      error
    );
    throw new Error("Unable to fetch comments for the event");
  } finally {
    await prisma.$disconnect();
  }
}

// Function to calculate and update the average rating for the event
export async function updateEventRating(eventId: string): Promise<void> {
  try {
    const { _avg } = await prisma.comment.aggregate({
      where: { eventId },
      _avg: { rating: true }, // Calculate average rating
    });

    const newRating = _avg.rating ?? 0;

    await prisma.event.update({
      where: { id: eventId },
      data: { rating: newRating },
    });
  } catch (error) {
    console.error(`Error updating rating for event with id ${eventId}:`, error);
    throw new Error("Unable to update event rating");
  } finally {
    await prisma.$disconnect();
  }
}
type CommentType = {
  authorImageUrl: string;
  clerkId: string;
  commentText: string;
  rating: number;
  eventId: string;
  authorName: string;
};
export async function createComment({
  authorImageUrl,
  clerkId,
  commentText,
  rating,
  eventId,
  authorName,
}: CommentType): Promise<Comment> {
  try {
    const comment = await prisma.comment.create({
      data: {
        clerkId,
        eventId,
        authorImageUrl,
        commentText,
        rating,
        authorName,
      },
    });

    await updateEventRating(eventId);

    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Unable to create comment");
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Unable to delete comment");
  } finally {
    await prisma.$disconnect();
  }
}
