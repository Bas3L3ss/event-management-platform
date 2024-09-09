import React from "react";
import Logo from "./Logo";
import { NavLinks } from "./NavLinks";
import { ModeToggle } from "./ThemeToggle";
import { UserButton } from "@clerk/nextjs";

function PcNavBar() {
  return (
    <div className=" md:flex hidden    justify-between">
      <Logo />
      <NavLinks />
      <span className="flex items-center justify-center gap-2">
        <ModeToggle />
        <UserButton />
      </span>
    </div>
  );
}

export default PcNavBar;
