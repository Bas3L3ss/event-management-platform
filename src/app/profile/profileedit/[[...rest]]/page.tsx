import Container from "@/components/Container";
import EditBio from "@/components/EditBio";
import Title from "@/components/Title";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getUserFromDataBase } from "@/utils/actions/usersActions";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

async function EditMyProfilePage() {
  const clerkId = authenticateAndRedirect();
  const user = await getUserFromDataBase(clerkId);
  const userBio = user?.userBiography;

  return (
    <>
      <Container>
        <Title title="Edit profile" className="pt-24 " />
        <EditBio clerkID={clerkId} bioDataFromDB={userBio} />
        <div className="flex justify-center  ">
          <UserProfile path="/profile/profileedit" />
        </div>
      </Container>
    </>
  );
}

export default EditMyProfilePage;
