import React from "react";
import Container from "./Container";
import PcNavBar from "./PcNavBar";
import MobileNav from "./MobileNavBar";
import { auth } from "@clerk/nextjs/server";
import { getUnseenNotificationsByClerkId } from "@/utils/actions/usersActions";

async function NavBar() {
  const userId = auth().userId;
  let unSeenNotificationsCount: number | undefined = undefined;

  if (userId) {
    const notifications = await getUnseenNotificationsByClerkId(userId);
    unSeenNotificationsCount = notifications?.length;
  }

  return (
    <nav className="border-b py-4 sticky w-full isolate z-[999] bg-inherit top-0 left-0 ">
      <Container className="mx-auto">
        <PcNavBar unSeenNotificationsCount={unSeenNotificationsCount} />
        <MobileNav
          userId={userId}
          unSeenNotificationsCount={unSeenNotificationsCount}
        />
      </Container>
    </nav>
  );
}

export default NavBar;
