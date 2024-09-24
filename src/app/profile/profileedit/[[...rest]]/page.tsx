import Container from "@/components/Container";
import EditBio from "@/components/EditBio";
import Title from "@/components/Title";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getUserFromDataBase } from "@/utils/actions/usersActions";
import { UserProfile } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function EditMyProfilePage() {
  const clerkId = authenticateAndRedirect();

  const user = await getUserFromDataBase(clerkId);
  if (!user) {
    redirect("/");
  }
  const userBio = user?.userBiography;

  return (
    <>
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
              <BreadcrumbPage>Edit profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Title title="Edit profile" />
        <EditBio clerkID={clerkId} bioDataFromDB={userBio} />
        <div className="flex justify-center  ">
          <UserProfile path="/profile/profileedit" />
        </div>
      </Container>
    </>
  );
}

export default EditMyProfilePage;
