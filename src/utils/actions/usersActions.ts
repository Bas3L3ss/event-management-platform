import { revalidatePath } from "next/cache";
import prisma from "../db";
import { redirect } from "next/dist/server/api-utils";
import { authenticateAndRedirect } from "./clerkFunc";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "@prisma/client";

export async function createUser({
  clerkId,
  userName,
  userEmail,
  userAvatar = "",
  userBiography = "",
  userPhone = "",
}: {
  clerkId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  userBiography?: string;
  userPhone?: string;
}) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId,
        userName,
        userEmail,
        userAvatar,
        userBiography,
        isAuthorizedUser: false,
        userPhone,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Could not create user.");
  }
}

export async function updateUser({
  clerkId,
  userName,
  userEmail,
  userAvatar = "",
  userPhone = "",
  userBiography = "",
}: {
  clerkId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userBiography?: string;
  userPhone?: string;
}) {
  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        userName,
        userEmail,
        userAvatar,
        userBiography,
        userPhone,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Could not update user.");
  }
}
export async function SoftDeleteUser(clerkId: string) {
  try {
    const deletedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        deletedAt: new Date(),
      },
    });

    return deletedUser;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Could not deleting user.");
  }
}

export const getUserFromDataBase = async (clerkId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        clerkId,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Could not get user.");
  }
};

export async function getUniqueEventTypes(clerkId: string): Promise<string[]> {
  try {
    // Fetch distinct event types for the given clerkId
    const eventTypes = await prisma.event.findMany({
      where: { clerkId },
      select: { type: true },
    });

    return eventTypes.map((event) => event.type);
  } catch (error) {
    console.error("Error fetching unique event types:", error);
    throw new Error("Failed to fetch unique event types");
  }
}

export async function followUser(followerId: string, followedId: string) {
  try {
    if (followedId === followerId) {
      return console.log("cant follow yourself");
    }
    const followerExists = await prisma.user.findUnique({
      where: { clerkId: followerId },
    });

    const followedExists = await prisma.user.findUnique({
      where: { clerkId: followedId },
    });

    if (!followerExists || !followedExists) {
      throw new Error("One of the users does not exist");
    }

    if (
      followerExists.followedByUsers.includes(followedId) ||
      followedExists.followers.includes(followerId)
    ) {
      return console.log("cant follow twice");
    }
    await prisma.user.update({
      where: { clerkId: followerId },
      data: {
        followedByUsers: {
          push: followedId,
        },
      },
    });

    await prisma.user.update({
      where: { clerkId: followedId },
      data: {
        followers: {
          push: followerId,
        },
      },
    });
  } catch (error) {
    console.error("Error following user:", error);
  }
}
export async function unFollowUser(followerId: string, followedId: string) {
  try {
    if (followedId === followerId) {
      return "You cannot unfollow yourself.";
    }

    const followerExists = await prisma.user.findUnique({
      where: { clerkId: followerId },
    });

    const followedExists = await prisma.user.findUnique({
      where: { clerkId: followedId },
    });

    if (!followerExists || !followedExists) {
      return "One of the users does not exist.";
    }

    if (
      !followerExists.followedByUsers.includes(followedId) ||
      !followedExists.followers.includes(followerId)
    ) {
      return console.log("You cannot unfollow a user you are not following.");
    }

    await prisma.user.update({
      where: { clerkId: followerId },
      data: {
        followedByUsers: {
          set: followerExists.followedByUsers.filter((id) => id !== followedId),
        },
      },
    });

    await prisma.user.update({
      where: { clerkId: followedId },
      data: {
        followers: {
          set: followedExists.followers.filter((id) => id !== followerId),
        },
      },
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
  }
}

export async function isFollowable(
  followerId: string,
  followedId: string
): Promise<boolean> {
  try {
    // User cannot follow themselves
    if (followerId === followedId) {
      return true;
    }

    // Check if both users exist
    const followerExists = await prisma.user.findUnique({
      where: { clerkId: followerId },
    });

    const followedExists = await prisma.user.findUnique({
      where: { clerkId: followedId },
    });

    if (!followerExists || !followedExists) {
      return false;
    }

    // Check if the follower is already following the user
    const isAlreadyFollowing =
      followerExists.followedByUsers.includes(followedId);

    // If they are already following, they cannot follow again
    return !isAlreadyFollowing;
  } catch (error) {
    console.error("Error checking if user is followable:", error);
    return false;
  }
}

export async function getUsersWhoFollow(followedByUsers: string[]) {
  try {
    const users = await prisma.user.findMany({
      where: {
        clerkId: {
          in: followedByUsers, // This checks if any users match the given clerkIds in the array
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users who follow:", error);
    throw error;
  }
}
export async function getUsersIsBeingFollowed(followers: string[]) {
  try {
    const users = await prisma.user.findMany({
      where: {
        clerkId: {
          in: followers, // This checks if any users match the given clerkIds in the array
        },
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users who follow:", error);
    throw new Error("failed to fetch users");
  }
}

export async function createNotification(
  userId: string,
  eventId: string,
  title: string,
  description: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }
    const usersToSendNotificationTo: User[] = await getUsersWhoFollow(
      user.followedByUsers
    );

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        clerkId: true,
      },
    });

    if (!event) {
      throw new Error(`Event with ID ${eventId} not found.`);
    }
    usersToSendNotificationTo.map(async (follower) => {
      const notification = await prisma.notification.create({
        data: {
          clerkId: follower.clerkId,
          eventId: eventId,
          userAvatar: user.userAvatar,
          userName: user.userName,
          description: description,
          title: title,
          userId: follower.id,
        },
      });
    });
  } catch (error) {
    // Log the error
    console.error("Error creating notification:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new Error(`Notification with similar details already exists.`);
        default:
          throw new Error(
            "An unexpected error occurred while creating the notification."
          );
      }
    }

    throw new Error("An error occurred while creating the notification.");
  } finally {
    await prisma.$disconnect();
  }
}

export const getNotificationsByClerkId = async () => {
  const clerkId = authenticateAndRedirect();
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        clerkId,
      },
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("failed to fetch notifications");
  }
};
export const getUnseenNotificationsByClerkId = async (clerkId: string) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        clerkId,
        NOT: {
          seenStatus: true,
        },
      },
    });
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("failed to fetch notifications");
  }
};

export const changeSeenStateNotification = async (
  id: string,
  isSeenState: boolean
) => {
  try {
    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        seenStatus: isSeenState,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserByClerkId = async (clerkId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};
