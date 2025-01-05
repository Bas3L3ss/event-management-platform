import { NextResponse } from "next/server";
import { deleteComment } from "@/utils/actions/eventsActions";

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;

  const { eventId } = await req.json();

  if (!commentId || !eventId) {
    return NextResponse.json(
      { error: "Comment ID and Event ID are required" },
      { status: 400 }
    );
  }

  try {
    await deleteComment(commentId, eventId);

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
