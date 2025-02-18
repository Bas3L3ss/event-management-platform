import { auth } from "@clerk/nextjs/server";
import React from "react";
import { ListItem } from "./NavLinks";
import { SignOutButton } from "@clerk/nextjs";

export function SignUpAndSignInCheck({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  const userId = auth().userId;

  if (userId) return null;
  return (
    <div>
      <ListItem title={title} href={href}>
        {description}
      </ListItem>
    </div>
  );
}

export function LogInCheck({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description: string;
}) {
  const userId = auth().userId;

  if (!userId) return null;

  return (
    <SignOutButton>
      <ListItem title={title} href={href}>
        {description}
      </ListItem>
    </SignOutButton>
  );
}
