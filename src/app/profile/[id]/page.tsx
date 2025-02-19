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
import { notFound, redirect } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Metadata } from "next";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const userFromDataBase = await getUserFromDataBase(id);

  if (!userFromDataBase) {
    return {
      title: "User Profile Not Found | Event Management platform",
      description: "The requested user profile could not be found.",
    };
  }

  return {
    title: `${userFromDataBase.userName}'s Profile | Event Management platform`,
    description: `View ${userFromDataBase.userName}'s profile and events`,
    openGraph: {
      title: `${userFromDataBase.userName}'s Profile`,
      description: `Check out ${userFromDataBase.userName}'s profile and events`,
      images: [{ url: userFromDataBase.userAvatar }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${userFromDataBase.userName}'s Profile`,
      description: `Check out ${userFromDataBase.userName}'s profile and events`,
      images: [userFromDataBase.userAvatar],
    },
  };
}

async function SomeoneProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const userFromDataBase = await getUserFromDataBase(id);
  if (!userFromDataBase) {
    return notFound();
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
