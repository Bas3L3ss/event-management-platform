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
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  const userClerkId = authenticateAndRedirect();
  const userFromDataBase = await getUserFromDataBase(userClerkId);

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
    return notFound();
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
