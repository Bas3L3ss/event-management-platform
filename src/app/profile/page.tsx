import UserProfilePage from "@/components/ProfilePage";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getUserLengthByClerkId } from "@/utils/actions/eventsActions";
import { getUserFromDataBase } from "@/utils/actions/usersActions";
import { toastPrint } from "@/utils/toast action/action";
import { redirect } from "next/navigation";
import React from "react";

async function ProfilePage() {
  const userClerkId = authenticateAndRedirect();
  const eventLength = await getUserLengthByClerkId(userClerkId);
  const userFromDataBase = await getUserFromDataBase(userClerkId);

  if (!userFromDataBase) {
    toastPrint(
      "Notice",
      "Your user seem to not be in the database, please contact this website admin to fix this problem",
      "destructive"
    );
    redirect("/");
  }

  return (
    <>
      <UserProfilePage
        userFromDataBase={userFromDataBase}
        eventLength={eventLength}
      />
    </>
  );
}

export default ProfilePage;
