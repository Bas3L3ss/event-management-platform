import Container from "@/components/Container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import UserFollowerOrFollowingDisplay from "@/components/UserFollowerOrFollowingDisplay";
import {
  getUserFromDataBase,
  getUsersIsBeingFollowed,
} from "@/utils/actions/usersActions";
import { toastPrint } from "@/utils/toast action/action";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

async function FollowingPageOfOther({
  params: { id },
}: {
  params: { id: string };
}) {
  const userFromDb: User | null = await getUserFromDataBase(id);
  if (!userFromDb) {
    redirect("/");
  }
  const followingsUsers = await getUsersIsBeingFollowed(userFromDb.followers);

  return (
    <Container className="mt-10 flex flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/profile">Profile</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/profile/following">Following</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{userFromDb.userName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <UserFollowerOrFollowingDisplay
        username={userFromDb.userName}
        UserData={followingsUsers}
      />
    </Container>
  );
}

export default FollowingPageOfOther;
