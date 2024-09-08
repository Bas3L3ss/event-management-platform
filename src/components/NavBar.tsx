import React from "react";
import Logo from "./Logo";
import Container from "./Container";
import { ModeToggle } from "./ThemeToggle";
import { NavLinks } from "./NavLinks";

function NavBar() {
  return (
    <nav className="border-b  py-4 ">
      <Container className="mx-auto flex justify-between  ">
        <Logo />
        <NavLinks />
        <ModeToggle />
      </Container>
    </nav>
  );
}

export default NavBar;
