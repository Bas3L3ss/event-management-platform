import UserProfilePage from "@/components/ProfilePage";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getUserLengthByClerkId } from "@/utils/actions/eventsActions";
import {
  getUniqueEventTypes,
  getUserFromDataBase,
} from "@/utils/actions/usersActions";
import { EventType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

async function ProfilePage() {
  const userClerkId = authenticateAndRedirect();

  const eventLength = await getUserLengthByClerkId(userClerkId);
  const userFromDataBase = await getUserFromDataBase(userClerkId);
  const typeUserSubmitted = await getUniqueEventTypes(userClerkId);
  let typeUserSubmittedArr: EventType[] = [];
  const typeUserSubmittedSet = new Set(typeUserSubmitted).forEach((el) =>
    typeUserSubmittedArr.push(el as EventType)
  );

  if (!userFromDataBase) {
    redirect("/");
  }

  return (
    <>
      <UserProfilePage
        typeUserSubmitted={typeUserSubmittedArr}
        userFromDataBase={userFromDataBase}
        eventLength={eventLength}
      />
    </>
  );
}

export default ProfilePage;
