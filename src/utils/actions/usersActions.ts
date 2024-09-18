import prisma from "../db";

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
    throw new Error("Could not create user.");
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
