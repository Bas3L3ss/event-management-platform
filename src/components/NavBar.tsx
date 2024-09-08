import React from "react";

import Container from "./Container";
import PcNavBar from "./PcNavBar";
import MobileNav from "./MobileNavBar";

function NavBar() {
  return (
    <nav className="border-b  py-4 ">
      <Container className="mx-auto">
        <PcNavBar />
        <MobileNav />
      </Container>
    </nav>
  );
}

export default NavBar;
