import Container from "@/components/Container";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

function EditMyProfilePage() {
  return (
    <>
      <Container>
        <div className="flex justify-center py-24">
          <UserProfile path="/profile/profileedit" />
        </div>
      </Container>
    </>
  );
}

export default EditMyProfilePage;
