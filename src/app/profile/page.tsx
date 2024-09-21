import UserProfilePage from "@/components/ProfilePage";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getUserLengthByClerkId } from "@/utils/actions/eventsActions";
import {
  getUniqueEventTypes,
  getUserFromDataBase,
} from "@/utils/actions/usersActions";
import { redirect } from "next/navigation";
import React from "react";

async function ProfilePage() {
  const userClerkId = authenticateAndRedirect();

  const eventLength = await getUserLengthByClerkId(userClerkId);
  const userFromDataBase = await getUserFromDataBase(userClerkId);
  const typeUserSubmitted = await getUniqueEventTypes(userClerkId);

  if (!userFromDataBase) {
    redirect("/");
  }

  return (
    <>
      <UserProfilePage
        typeUserSubmitted={typeUserSubmitted}
        userFromDataBase={userFromDataBase}
        eventLength={eventLength}
      />
    </>
  );
}

export default ProfilePage;
