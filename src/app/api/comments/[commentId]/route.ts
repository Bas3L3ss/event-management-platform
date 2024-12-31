import { NextResponse } from "next/server";
import { deleteComment } from "@/utils/actions/eventsActions";

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const { commentId } = params;

  if (!commentId) {
    return NextResponse.json(
      { error: "Comment ID is required" },
      { status: 400 }
    );
  }
  try {
    await deleteComment(commentId);

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
