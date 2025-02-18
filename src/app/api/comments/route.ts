import { createComment } from "@/utils/actions/eventsActions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clerkId,
      commentText,
      rating,
      eventId,
      authorName,
      authorImageUrl,
    } = body;

    const comment = await createComment({
      clerkId,
      commentText,
      rating,
      eventId,
      authorName,
      authorImageUrl,
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Unable to create comment" },
      { status: 500 }
    );
  }
}
