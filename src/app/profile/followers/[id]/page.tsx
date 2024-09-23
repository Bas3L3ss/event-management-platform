import {
  getUserFromDataBase,
  getUsersWhoFollow,
} from "@/utils/actions/usersActions";
import { toastPrint } from "@/utils/toast action/action";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

async function FollowersPageOfOther({
  params: { id },
}: {
  params: { id: string };
}) {
  const userFromDb: User | null = await getUserFromDataBase(id);
  if (!userFromDb) {
    toastPrint("Notice", "This user is not in the database");
    redirect("/");
  }
  const followersUser = await getUsersWhoFollow(userFromDb.followedByUsers);
  console.log(followersUser);

  return <div></div>;
}

export default FollowersPageOfOther;
