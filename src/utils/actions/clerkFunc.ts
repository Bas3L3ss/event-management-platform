import { useToast } from "@/hooks/use-toast";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export function authenticateAndRedirect(): string {
  const { userId } = auth();
  if (userId === null) {
    redirect("/");
  }
  return userId;
}
