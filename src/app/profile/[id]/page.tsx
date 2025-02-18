import Container from "@/components/Container";
import OtherProfilePage from "@/components/OtherProfilePage";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

async function SomeoneProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const userFromDataBase = await getUserFromDataBase(id);
  if (!userFromDataBase) {
    redirect("/");
  }
  const eventLength = await getUserLengthByClerkId(id);

  const typeUserSubmitted = await getUniqueEventTypes(id);
  let typeUserSubmittedArr: EventType[] = [];
  const typeUserSubmittedSet = new Set(typeUserSubmitted).forEach((el) =>
    typeUserSubmittedArr.push(el as EventType)
  );

  const eventUserSubmitted = await getEventByClerkId(id);

  return (
    <Container className="mt-10 space-y-6">
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
            <BreadcrumbPage>{userFromDataBase.userName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <OtherProfilePage
        eventLength={eventLength}
        typeUserSubmitted={typeUserSubmittedArr}
        userFromDataBase={userFromDataBase!}
        eventUserSubmitted={eventUserSubmitted}
      />
    </Container>
  );
}

export default SomeoneProfilePage;
