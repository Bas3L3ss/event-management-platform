import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const { clerkID, bioData } = payload;
    console.log(clerkID, bioData, payload);

    if (!clerkID || !bioData) {
      console.log("missing data");

      return NextResponse.json(
        { error: "Missing clerkID or bioData" },
        { status: 400 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: { clerkId: clerkID },
      data: { userBiography: bioData },
    });

    revalidatePath("/profile/profileedit");
    console.log("updated User");

    return NextResponse.json(
      { message: "Bio updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating bio:", error);

    // Return an error response if something goes wrong
    return NextResponse.json(
      { error: "Failed to update bio" },
      { status: 500 }
    );
  }
}
