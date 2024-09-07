import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default function Page() {
  if (auth().userId) redirect("/");
  return <SignIn />;
}
