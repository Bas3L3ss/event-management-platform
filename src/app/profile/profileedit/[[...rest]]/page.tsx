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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function EditMyProfilePage() {
  const clerkId = authenticateAndRedirect();

  const user = await getUserFromDataBase(clerkId);
  if (!user) {
    redirect("/");
  }
  const userBio = user?.userBiography;

  return (
    <Container className="py-8 space-y-6">
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

      <Title title="Edit Profile" className="text-3xl font-bold" />

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clerk-profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clerk-profile">Clerk Profile</TabsTrigger>
              <TabsTrigger value="bio">Biography</TabsTrigger>
            </TabsList>
            <TabsContent value="clerk-profile" className="mt-4">
              <div className="bg-background p-4 rounded-lg w-full h-full flex items-center justify-center ">
                <UserProfile path="/profile/profileedit" />
              </div>
            </TabsContent>
            <TabsContent value="bio" className="mt-4">
              <EditBio clerkID={clerkId} bioDataFromDB={userBio} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
}

export default EditMyProfilePage;
