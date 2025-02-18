import Container from "@/components/Container";
import UserProfilePage from "@/components/ProfilePage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import {
  getEventByClerkId,
  getUserLengthByClerkId,
} from "@/utils/actions/eventsActions";
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
  const eventUserSubmitted = await getEventByClerkId(userClerkId);

  return (
    <Container className="mt-10 flex flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <UserProfilePage
        typeUserSubmitted={typeUserSubmittedArr}
        userFromDataBase={userFromDataBase}
        eventLength={eventLength}
        eventUserSubmitted={eventUserSubmitted}
      />
    </Container>
  );
}

export default ProfilePage;
