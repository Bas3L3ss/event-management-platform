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
