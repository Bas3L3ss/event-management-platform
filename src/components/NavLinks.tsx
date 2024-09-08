import Link from "next/link";
import React from "react";
import { links } from "@/utils/types/NavTypes";
import { auth } from "@clerk/nextjs/server";

function NavLinks() {
  const userId = auth().userId;
  const isAdmin = userId === process.env.CLERK_ADMIN_ID;

  return (
    <div className="flex">
      {links.map((link) => {
        if (!isAdmin && link.label === "dashboard") return null;
        return (
          <Link key={link.label} href={link.href}>
            {link.label}
          </Link>
        );
      })}
      {!userId && (
        <div className="flex">
          <Link href={"/sign-up"}>Signup</Link>
          <Link href={"/sign-in"}>SignIn</Link>
        </div>
      )}
      {userId && <Link href={"/profile"}>Profile</Link>}
    </div>
  );
}

export default NavLinks;
