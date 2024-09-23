"use client";
import { SignUp, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Page() {
  return (
    <div className="flex justify-center py-24">
      <SignUp />
    </div>
  );
}
