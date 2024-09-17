import prisma from "../db";

export async function createUser({
  clerkId,
  userName,
  userEmail,
  userAvatar = "",
  userBiography = "",
}: {
  clerkId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  userBiography?: string;
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
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Could not create user.");
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
