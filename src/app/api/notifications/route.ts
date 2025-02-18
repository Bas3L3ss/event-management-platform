// pages/api/comments.ts
import { createComment } from "@/utils/actions/eventsActions";
import {
  changeSeenStateNotification,
  getUnseenNotificationsByClerkId,
} from "@/utils/actions/usersActions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// For a POST request handler
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { notificationId, isSeen } = body;

    // Call the createComment function
    await changeSeenStateNotification(notificationId, isSeen);
    revalidatePath(`/notifications`);
    // Return the newly created comment
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Unable to change notification" },
      { status: 500 }
    );
  }
}
