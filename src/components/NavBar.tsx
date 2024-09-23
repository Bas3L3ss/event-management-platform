import React from "react";

import Container from "./Container";
import PcNavBar from "./PcNavBar";
import MobileNav from "./MobileNavBar";
import { auth } from "@clerk/nextjs/server";

function NavBar() {
  const authUser = auth().userId;

  return (
    <nav className="border-b  py-4 sticky w-full  isolate z-[100] bg-inherit top-0 left-0">
      <Container className="mx-auto">
        <PcNavBar />
        <MobileNav userId={authUser} />
      </Container>
    </nav>
  );
}

export default NavBar;
