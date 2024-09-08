import React from "react";
import Logo from "./Logo";
import { NavLinks } from "./NavLinks";
import { ModeToggle } from "./ThemeToggle";

function PcNavBar() {
  return (
    <div className=" md:flex hidden    justify-between">
      <Logo />
      <NavLinks />
      <ModeToggle />
    </div>
  );
}

export default PcNavBar;
