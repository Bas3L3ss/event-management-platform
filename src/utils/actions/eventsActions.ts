"use server";

import { Comment, Event, EventStatus, EventType, Order } from "@prisma/client";
import prisma from "../db";
import { authenticateAndRedirect } from "./clerkFunc";
import {
  eventPaidSchema,
  eventSchema,
  filesEditSchema,
  filesSchema,
  validateWithZodSchema,
} from "../schema";
import {
  deleteImages,
  deleteVideo,
  uploadImages,
  uploadVideo,
} from "../supabase";
import { createOrderAction } from "./ordersActions";
import { EventSchemaType, FullEventSchemaType } from "../types/EventTypes";
import { renderError } from "../utils";
import { cache } from "../cache";
async function cachedGetLatestFeaturedEvent(amount: number = 2) {
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
const getCachedLatestFeaturedEvent = (amount: number = 2) => {
  return cache(cachedGetLatestFeaturedEvent, ["featured-events"], {
    revalidate: 60, // Revalidate cache every 60 seconds
  })(amount);
};
export async function getLatestFeaturedEvent(amount: number = 2) {
  // Call the cached version of the fetchEvents function
  return await getCachedLatestFeaturedEvent(amount);
}

async function cachedGetOneLatestFeaturedEvent() {
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
    });

    return latestEvent;
  } catch (error) {
    console.error("Error fetching the latest featured event:", error);
    throw new Error("Unable to fetch the latest featured event");
  } finally {
    await prisma.$disconnect();
  }
}

const getCachedGetOneLatestFeaturedEvent = cache(
  cachedGetOneLatestFeaturedEvent,
  ["one-featured-events"],
  {
    revalidate: 60, // Revalidate cache every 60 seconds
  }
);
export async function getOneLatestFeaturedEvent() {
  // Call the cached version of the fetchEvents function
  return await getCachedGetOneLatestFeaturedEvent();
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

async function cachedGetAllEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
        },
      },
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

const getCachedEvents = cache(cachedGetAllEvents, ["events"], {
  revalidate: 60, // Revalidate cache every 60 seconds
});
export async function getAllEvents() {
  // Call the cached version of the fetchEvents function
  return await getCachedEvents();
}

export async function getAllInAdminPageEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: "asc",
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
//getEventById
async function cachedGetEventById(id: string) {
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

// Wrap the fetchEventById function with caching logic
const getCachedEventById = (id: string) => {
  return cache(cachedGetEventById, ["event", id], {
    revalidate: 20,
  })(id);
};

export async function getEventById(id: string): Promise<Event | null> {
  return await getCachedEventById(id);
}

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
          contains: searchTerm,
          mode: "insensitive",
        },
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
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
export async function searchAndFilterUserSpecificEvents(
  clerkId: string,
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
        clerkId,
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
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
        },
      },
    });

    return events.length;
  } catch (error) {
    console.error("Error getting events:", error);
    throw new Error("Unable to fetch events");
  }
};
export const getEventFromClerkId = async (clerkId: string) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        clerkId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  } catch (error) {
    console.error("Error getting events:", error);
    throw new Error("Unable to fetch events");
  }
};
// getCommentsByEventId
async function cachedGetCommentsByEventId(eventId: string) {
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

// Wrap the fetchCommentsByEventId function with caching logic
const getCachedCommentsByEventId = (eventId: string) => {
  return cache(cachedGetCommentsByEventId, ["comments", eventId], {
    revalidate: 60, // Revalidate cache every 60 seconds
  })(eventId); // Call the caching function with eventId
};

export async function getCommentsByEventId(
  eventId: string
): Promise<Comment[]> {
  // Call the cached version of the fetchCommentsByEventId function, passing the eventId
  return await getCachedCommentsByEventId(eventId);
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
    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    console.log(comment);
    await updateEventRating(comment.eventId);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw new Error("Unable to delete comment");
  } finally {
    await prisma.$disconnect();
  }
}

export const createEventAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string; isError: boolean }> => {
  const clerkId = authenticateAndRedirect();

  try {
    const rawData = Object.fromEntries(formData);
    const images = formData.getAll("image") as File[];

    if (images.length > 3) {
      return { message: "For now we only accept 3 images.", isError: true };
    }

    const video = formData.get("video") as File;
    const validatedFields = validateWithZodSchema(eventSchema, rawData);
    const validatedFiles = validateWithZodSchema(filesSchema, {
      image: images,
      video: video,
    });

    const imageUrls = await uploadImages(images);

    // Upload video and get URL
    const videoUrl = await uploadVideo(video);

    const newEvent = await prisma.event.create({
      data: {
        clerkId,
        dateEnd: validatedFields.dateEnd as Date,
        dateStart: validatedFields.dateStart as Date,
        eventDescription: validatedFields.description,
        eventLocation: validatedFields.eventLocation,
        eventName: validatedFields.eventName,
        eventTicketPrice: validatedFields.price,
        type: validatedFields.eventType,
        eventImg: imageUrls,
        eventVideo: videoUrl,
        hostName: validatedFields.host,
        reservationTicketLink: validatedFields.reservationTicketLink,
        eventImgOrVideoFirstDisplay: validatedFields.isVideoFirstDisplay
          ? videoUrl
          : imageUrls[0],
      },
    });

    await createOrderAction(clerkId, newEvent);

    return { message: "product created", isError: false };
  } catch (error) {
    return renderError(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const updateEventAction = async (
  prevState: unknown,
  formData: FormData
): Promise<{ message: string; isError: boolean }> => {
  const clerkId = await authenticateAndRedirect();

  try {
    const imagesUrl: string[] = [];
    for (let [key, value] of formData.entries()) {
      if (key.startsWith("imagesCheckBox-")) {
        imagesUrl.push(value as string);
      }
    }

    const rawData = Object.fromEntries(formData);
    const images = formData.getAll("image") as File[];
    const video = formData.get("video") as File;
    const eventId = formData.get("id") as string;
    const isPaid = formData.get("isPaid") === "true";
    const imagesFiltered = images.filter(
      (file) => file.size > 0 && file.name !== "undefined"
    );
    const validFile =
      video && video.size > 0 && video.name !== "undefined" ? video : undefined;

    // Validate the fields using Zod

    const validatedFields = validateWithZodSchema(
      isPaid ? eventPaidSchema : eventSchema,
      rawData
    ) as typeof isPaid extends true ? EventSchemaType : FullEventSchemaType;

    const validatedFiles = validateWithZodSchema(filesEditSchema, {
      image: imagesFiltered,
      video: validFile,
    });

    const eventFileFromDB = await prisma.event.findUnique({
      where: { id: eventId },
      select: { eventImg: true, eventVideo: true }, // Select only the images field
    });

    if (!eventFileFromDB) {
      throw new Error("invalid edit");
    }
    let imagesWillBeSentToDB = eventFileFromDB?.eventImg;
    let videoWillBeSentToDB = eventFileFromDB?.eventVideo;

    if (validatedFiles.image) {
      if (validatedFiles.image.length + imagesWillBeSentToDB.length > 3) {
        return {
          message: "You can't send more than 3 images.",
          isError: false,
        };
      }
    }
    if (validatedFiles.image != undefined && validatedFiles.image.length > 0) {
      const imageUrls = await uploadImages(images);
      imagesWillBeSentToDB = imagesWillBeSentToDB.concat(imageUrls);
    }

    if (validatedFiles.video != undefined) {
      const videoUrl = await uploadVideo(video);
      const data = await deleteVideo(videoWillBeSentToDB as string);

      videoWillBeSentToDB = videoUrl;
    }

    if (imagesUrl.length > 0) {
      imagesWillBeSentToDB = eventFileFromDB.eventImg.filter(
        (item) => !imagesUrl.includes(item)
      );

      await deleteImages(imagesUrl);
    }

    const updateData: any = {
      clerkId,
      eventDescription: validatedFields.description,
      eventLocation: validatedFields.eventLocation,
      eventName: validatedFields.eventName,
      eventTicketPrice: validatedFields.price,
      type: validatedFields.eventType,
      eventImg: imagesWillBeSentToDB,
      eventVideo: videoWillBeSentToDB,
      hostName: validatedFields.host,
      reservationTicketLink: validatedFields.reservationTicketLink,
      eventImgOrVideoFirstDisplay: validatedFields.isVideoFirstDisplay
        ? videoWillBeSentToDB
        : imagesWillBeSentToDB[0],
    };

    if (!isPaid) {
      updateData.dateStart = validatedFields.dateStart as Date;
      updateData.dateEnd = validatedFields.dateEnd as Date;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });
    await prisma.order.update({
      where: {
        eventId: updatedEvent.id,
      },
      data: {
        eventName: updatedEvent.eventName,
      },
    });

    return {
      message:
        "Event updated successfully, please wait 50s-60s to see the update",
      isError: false,
    };
  } catch (error) {
    return renderError(error);
  } finally {
    await prisma.$disconnect();
  }
};
export const getOrderByEventId = async (id: string) => {
  try {
    const order: Order | null = await prisma.order.findFirst({
      where: {
        eventId: id,
      },
    });
    console.log(order);

    return order;
  } catch (error) {
    console.log(error);
    throw new Error("failed to get event order ");
  }
};

// getRandomEvents

async function cachedGetRandomEvents(eventId?: string) {
  try {
    let query = `
      SELECT * FROM "Event"
      WHERE 1=1
    `;

    if (eventId) {
      query += ` AND "id" != $1`; // Use parameterized query
    }

    query += `
      ORDER BY RANDOM()
      LIMIT 10;
    `;

    // Execute the query with the parameter
    let randomEvents: Event[];
    if (eventId) {
      randomEvents = await prisma.$queryRawUnsafe(query, eventId);
    } else {
      randomEvents = await prisma.$queryRawUnsafe(query);
    }

    return randomEvents;
  } catch (error) {
    console.error("Error fetching random events:", error);
    throw new Error("Failed to fetch random events");
  }
}
const getCachedRandomEvents = (eventId?: string) => {
  return cache(
    cachedGetRandomEvents,
    ["random-events", eventId ? eventId : ""],
    {
      revalidate: 60, // Revalidate cache every 60 seconds
    }
  )(eventId);
};

export async function getRandomEvents(eventId?: string) {
  // Call the cached version of the fetchEvents function
  return await getCachedRandomEvents(eventId);
}

export async function getEventByClerkId(clerkId: string) {
  try {
    const events = await prisma.event.findMany({
      where: {
        clerkId,
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    return events;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch events");
  }
}
export async function deleteEventWithRelations(eventId: string) {
  try {
    await prisma.$transaction([
      prisma.notification.deleteMany({
        where: { eventId },
      }),
      prisma.order.deleteMany({
        where: { eventId },
      }),
      prisma.event.delete({
        where: { id: eventId },
      }),
    ]);
    console.log("Event and all related data successfully deleted.");
  } catch (error) {
    console.error("Error deleting event and related data:", error);
  }
}
