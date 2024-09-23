"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div className="flex justify-center py-24">
      <SignIn />
    </div>
  );
}
