import { unFollowUser } from "@/utils/actions/usersActions";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { followerId, followedId } = await req.json();

  try {
    if (!followedId) {
      redirect("/sign-in");
    }
    await unFollowUser(followerId, followedId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
