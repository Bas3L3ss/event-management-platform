import React from "react";
import Logo from "./Logo";
import Container from "./Container";
import NavLinks from "./NavLinks";

function NavBar() {
  return (
    <nav className="border-b  py-4 ">
      <Container className="mx-0 ">
        <Logo />
        <NavLinks />
      </Container>
    </nav>
  );
}

export default NavBar;
