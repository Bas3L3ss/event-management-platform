"use server";

import {
  Comment,
  CommentLike,
  Event,
  EventStatus,
  EventType,
  Order,
} from "@prisma/client";
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
import { revalidatePath } from "next/cache";
import { LIMIT } from "@/constants/values";
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

export async function hasNext(
  offset: number,
  limit: number,
  clerkId?: string
): Promise<boolean> {
  try {
    const nextBatch = await prisma.event.findMany({
      where: {
        ...(clerkId && { clerkId }),
        NOT: {
          status: {
            in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
          },
        },
      },
      orderBy: {
        dateStart: "desc",
      },
      skip: offset,
      take: limit,
    });

    return nextBatch.length > 0;
  } catch (error) {
    console.error("Error checking for next events batch:", error);
    throw new Error("Unable to check for next events batch");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getEventsPaginated(
  offset: number,
  limit: number,
  searchTerm: string = "",
  filter?: {
    eventType?: EventType;
    status?: EventStatus;
    isFeatured?: boolean;
    minDate?: string;
    maxDate?: string;
    minRating?: number;
  },
  clerkId: string | undefined = undefined
) {
  try {
    if (filter) {
      return await searchAndFilterEvents(
        searchTerm,
        filter,
        offset,
        limit,
        clerkId
      );
    }

    const events = await prisma.event.findMany({
      where: {
        ...(clerkId && { clerkId }),
        eventName: {
          contains: searchTerm,
          mode: "insensitive",
        },
        ...(clerkId
          ? {}
          : {
              NOT: {
                status: {
                  in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
                },
              },
            }),
      },
      orderBy: {
        dateStart: "desc",
      },
      skip: offset,
      take: limit,
    });
    return events;
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Unable to fetch all events");
  } finally {
    await prisma.$disconnect();
  }
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
  },
  offset: number,
  limit: number,
  clerkId?: string
) {
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(clerkId && { clerkId }),
        eventName: {
          contains: searchTerm,
          mode: "insensitive",
        },
        ...(clerkId
          ? {}
          : {
              NOT: {
                status: {
                  in: [EventStatus.NOT_CONFIRMED, EventStatus.ENDED],
                },
              },
            }),
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
        dateStart: "desc",
      },
      skip: offset,
      take: limit,
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
            in: [EventStatus.NOT_CONFIRMED],
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

async function cachedGetCommentsByEventId(eventId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { eventId, parentCommentId: null },
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
    revalidatePath(`/events/${eventId}`);

    return comment;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Unable to create comment");
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteComment(
  commentId: string,
  eventId: string
): Promise<void> {
  try {
    const [deletedComment] = await prisma.$transaction([
      prisma.comment.deleteMany({
        where: {
          parentCommentId: commentId,
        },
      }),
      prisma.comment.delete({
        where: {
          id: commentId,
        },
      }),
    ]);

    await updateEventRating(eventId);
    revalidatePath(`/events/${eventId}`);
  } catch (error) {
    console.error("Error deleting comment and its replies:", error);
    throw new Error("Unable to delete comment and its replies");
  } finally {
    await prisma.$disconnect();
  }
}

export const createEventAction = async (
  prevState: any,
  formData: any
): Promise<{ message: string; isError: boolean; order: Order | undefined }> => {
  const clerkId = authenticateAndRedirect();

  try {
    const rawData = Object.fromEntries(formData);

    const images = formData.getAll("image") as File[];

    if (images.length > 3) {
      return {
        message: "For now we only accept 3 images.",
        isError: true,
        order: undefined,
      };
    }
    if (rawData.latitude) {
      rawData.latitude = parseFloat(rawData.latitude);
    } else {
      throw new Error("No latitude is found.");
    }
    if (rawData.longitude) {
      rawData.longitude = parseFloat(rawData.longitude);
    } else {
      throw new Error("No longitude is found.");
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
        latitude: validatedFields.latitude,
        longitude: validatedFields.longitude,
        reservationTicketLink: validatedFields.reservationTicketLink,
        eventImgOrVideoFirstDisplay: validatedFields.isVideoFirstDisplay
          ? videoUrl
          : imageUrls[0],
      },
    });

    const order: Order | undefined = await createOrderAction(clerkId, newEvent);

    return { message: "product created", isError: false, order };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("eventName") &&
      error.message.includes("Unique")
    ) {
      throw new Error(
        "Event name already exists. Please choose a different name."
      );
    }
    throw new Error(
      error instanceof Error ? error.message : "An error occurred."
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const updateEventAction = async (
  prevState: unknown,
  formData: any
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
    console.log(rawData);
    if (rawData.latitude) {
      rawData.latitude = parseFloat(rawData.latitude);
    } else {
      return {
        isError: true,
        message: "No latitude is found.",
      };
    }
    if (rawData.longitude) {
      rawData.longitude = parseFloat(rawData.longitude);
    } else {
      return {
        isError: true,
        message: "No longitude is found.",
      };
    }

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

    const dataFromDB = await prisma.event.findUnique({
      where: { id: eventId },
      select: { eventImg: true, eventVideo: true, eventName: true }, // Select only the images field
    });

    if (!dataFromDB) {
      throw new Error("invalid edit");
    }
    let imagesWillBeSentToDB = dataFromDB?.eventImg;
    let videoWillBeSentToDB = dataFromDB?.eventVideo;

    if (validatedFiles.image) {
      if (validatedFiles.image.length + imagesWillBeSentToDB.length > 3) {
        return {
          message: "You can't have more than 3 images.",
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
      imagesWillBeSentToDB = dataFromDB.eventImg.filter(
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
      longitude: validatedFields.longitude,
      latitude: validatedFields.latitude,
    };

    if (!isPaid) {
      updateData.dateStart = validatedFields.dateStart as Date;
      updateData.dateEnd = validatedFields.dateEnd as Date;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
    });
    if (dataFromDB.eventName != updateData.eventName) {
      await prisma.order.update({
        where: {
          eventId: updatedEvent.id,
        },
        data: {
          eventName: updatedEvent.eventName,
        },
      });
    }

    return {
      message:
        "Event updated successfully, please wait 5s-6s to see the update",
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

async function cachedGetRandomEvents(eventId?: string): Promise<Event[]> {
  try {
    // Construct the base SQL query with status filtering
    let query = `
      SELECT * FROM "Event"
      WHERE "status" IN ('UPCOMING', 'STARTED') -- Only include public events
    `;

    // Exclude specific eventId if provided
    if (eventId) {
      query += ` AND "id" != $1`; // Use parameterized query
    }

    // Order the results randomly and limit to 10
    query += `
      ORDER BY RANDOM()
      LIMIT 10;
    `;

    // Execute the query with the eventId parameter if provided
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

// Caching wrapper function to manage revalidation and key generation
const getCachedRandomEvents = (eventId?: string) => {
  return cache(
    cachedGetRandomEvents,
    ["random-events", eventId ? eventId : ""],
    {
      revalidate: 60, // Revalidate cache every 60 seconds
    }
  )(eventId);
};

// Exported function to fetch random events with caching
export async function getRandomEvents(eventId?: string): Promise<Event[]> {
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

export async function replyToComment({
  clerkId,
  commentText,
  eventId,
  authorName,
  authorImageUrl,
  parentCommentId,
}: {
  clerkId: string;
  commentText: string;
  eventId: string;
  authorName: string;
  authorImageUrl: string;
  parentCommentId: string;
}): Promise<Comment> {
  try {
    const reply = await prisma.comment.create({
      data: {
        clerkId,
        commentText,
        eventId,
        authorName,
        authorImageUrl,
        parentCommentId,
      },
    });

    revalidatePath(`/events/${eventId}`);
    return reply;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw new Error("Unable to reply to comment");
  } finally {
    await prisma.$disconnect();
  }
}

export async function toggleLikeDislike({
  clerkId,
  commentId,
  action,
  eventId,
}: {
  clerkId: string;
  commentId: string;
  action: "like" | "dislike";
  eventId: string;
}): Promise<CommentLike | null | undefined> {
  try {
    // Find the existing like/dislike record for the comment and clerk
    const existingLike = await prisma.commentLike.findUnique({
      where: { clerkId_commentId: { clerkId, commentId } },
    });

    // Case 1: No existing like/dislike, so create a new like/dislike record
    if (!existingLike) {
      const newLikeDislike = await prisma.commentLike.create({
        data: {
          clerkId,
          commentId,
          disLike: action === "dislike" ? true : false, // Assign based on action
        },
      });

      return newLikeDislike;
    }

    // Case 2: Existing like
    if (!existingLike.disLike && action === "like") {
      // If they are clicking like again, remove the like (delete the record)
      await prisma.commentLike.delete({
        where: { clerkId_commentId: { clerkId, commentId } },
      });

      return null; // Indicating the like was removed
    }

    // Case 3: Existing like but switching to dislike
    if (!existingLike.disLike && action === "dislike") {
      // Change the like to a dislike
      const updatedLikeDislike = await prisma.commentLike.update({
        where: { clerkId_commentId: { clerkId, commentId } },
        data: {
          disLike: true, // Switch to dislike
        },
      });

      return updatedLikeDislike;
    }

    // Case 4: Existing dislike
    if (existingLike.disLike && action === "dislike") {
      // If they are clicking dislike again, remove the dislike (delete the record)
      await prisma.commentLike.delete({
        where: { clerkId_commentId: { clerkId, commentId } },
      });

      return null;
    }

    if (existingLike.disLike && action === "like") {
      // Change the dislike to a like
      const updatedLikeDislike = await prisma.commentLike.update({
        where: { clerkId_commentId: { clerkId, commentId } },
        data: {
          disLike: false, // Switch to like
        },
      });

      return updatedLikeDislike;
    }
  } catch (error) {
    console.error("Error toggling like/dislike:", error);
    throw new Error("Unable to toggle like/dislike");
  } finally {
    revalidatePath(`/events/${eventId}`);
  }
}

export async function updateComment({
  clerkId,
  commentId,
  commentText,
}: {
  clerkId: string;
  commentId: string;
  commentText: string;
}): Promise<Comment> {
  try {
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    if (existingComment.clerkId !== clerkId) {
      throw new Error("You are not authorized to update this comment");
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        commentText,
        isEdited: true,
      },
    });
    revalidatePath(`/events/${existingComment.eventId}`);

    return updatedComment;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw new Error("Unable to update comment");
  } finally {
    await prisma.$disconnect();
  }
}

export async function cachedGetRepliesToComment(
  parentCommentId: string
): Promise<Comment[]> {
  try {
    const replies = await prisma.comment.findMany({
      where: {
        parentCommentId,
      },
      orderBy: {
        createdAt: "asc", // Optional: Adjust ordering if needed
      },
    });

    return replies;
  } catch (error) {
    console.error(
      `Error fetching replies for parentCommentId ${parentCommentId}:`,
      error
    );
    throw new Error("Unable to fetch replies");
  } finally {
    await prisma.$disconnect();
  }
}

// Wrap the fetchRepliesToComment function with caching logic
const getCachedRepliesToComment = (parentCommentId: string) => {
  return cache(cachedGetRepliesToComment, ["replies", parentCommentId], {
    revalidate: 20, // Adjust the revalidation time as needed
  })(parentCommentId);
};

// Main exported function
export async function getRepliesToComment({
  parentCommentId,
}: {
  parentCommentId: string;
}): Promise<Comment[]> {
  return await getCachedRepliesToComment(parentCommentId);
}

export async function getLikesAndDislikes({
  commentId,
}: {
  commentId: string;
}): Promise<{ likeCount: number; dislikeCount: number }> {
  try {
    // Count likes (disLike is false) and dislikes (disLike is true)
    const likeCount = await prisma.commentLike.count({
      where: {
        commentId,
        disLike: false, // Count only the likes
      },
    });

    const dislikeCount = await prisma.commentLike.count({
      where: {
        commentId,
        disLike: true, // Count only the dislikes
      },
    });

    return { likeCount, dislikeCount };
  } catch (error) {
    console.error("Error counting likes and dislikes:", error);
    throw new Error("Unable to count likes and dislikes");
  } finally {
    await prisma.$disconnect();
  }
}

// Wrap the countLikesAndDislikes function with caching logic
const getCachedCountLikesAndDislikes = (commentId: string) => {
  return cache(getLikesAndDislikes, ["likesDislikes", commentId], {
    revalidate: 20, // Adjust the revalidation time as needed
  })({ commentId });
};

// Main exported function
export async function countLikesAndDislikes({
  commentId,
}: {
  commentId: string;
}): Promise<{ likeCount: number; dislikeCount: number }> {
  return await getCachedCountLikesAndDislikes(commentId);
}

// The original function to get the user's comment like
export async function fetchUserCommentLike({
  clerkId,
  commentId,
}: {
  clerkId: string;
  commentId: string;
}) {
  if (!clerkId) return undefined;
  try {
    const existingLike = await prisma.commentLike.findUnique({
      where: { clerkId_commentId: { clerkId, commentId } },
    });
    return existingLike;
  } catch (error) {
    console.error(
      `Error whilst getting user's comment like. clerkId: ${clerkId}, commentId: ${commentId}`,
      error
    );

    throw new Error("Unable to get user's comment like");
  }
}

// Wrap the fetchUserCommentLike function with caching logic
const getCachedUserCommentLike = (clerkId: string, commentId: string) => {
  return cache(fetchUserCommentLike, ["userCommentLike", clerkId, commentId], {
    revalidate: 20, // Adjust the revalidation time as needed
  })({ clerkId, commentId });
};

// Main exported function
export async function getUserCommentLike({
  clerkId,
  commentId,
}: {
  clerkId: string;
  commentId: string;
}) {
  return await getCachedUserCommentLike(clerkId, commentId);
}
