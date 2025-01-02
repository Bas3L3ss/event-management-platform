import React from "react";
import Logo from "./Logo";
import { NavLinks } from "./NavLinks";
import { ModeToggle } from "./ThemeToggle";
import { UserButton } from "@clerk/nextjs";

function PcNavBar({
  unSeenNotificationsCount,
}: {
  unSeenNotificationsCount?: number;
}) {
  return (
    <div className="md:flex hidden justify-between">
      <Logo />
      <NavLinks unSeenNotificationsCount={unSeenNotificationsCount} />
      <span className="flex items-center justify-center gap-2">
        <ModeToggle />
        <UserButton />
      </span>
    </div>
  );
}

export default PcNavBar;
