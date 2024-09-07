import { NextResponse } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/utils/db";

export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await request.json();

    console.log(payload);

    if (payload.type === "user.created") {
      const userData = payload.data;

      // Create the user in your database
      await prisma.user.create({
        data: {
          clerkId: userData.id,
          userName: userData.username || "",
          userBiography: "",
          userAvatar: userData.image_url || "",
          // Set other fields as needed
        },
      });

      return NextResponse.json({ message: "User created in database" });
    }

    return NextResponse.json({ message: "Event type not handled" });
  } catch (error) {
    console.error("Error handling webhook", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
