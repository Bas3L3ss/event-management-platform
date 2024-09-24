import Container from "@/components/Container";
import OtherProfilePage from "@/components/OtherProfilePage";
import { getUserLengthByClerkId } from "@/utils/actions/eventsActions";
import {
  getUniqueEventTypes,
  getUserFromDataBase,
} from "@/utils/actions/usersActions";
import { toastPrint } from "@/utils/toast action/action";
import { EventType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

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

  return (
    <>
      <OtherProfilePage
        eventLength={eventLength}
        typeUserSubmitted={typeUserSubmittedArr}
        userFromDataBase={userFromDataBase!}
      />
    </>
  );
}

export default SomeoneProfilePage;
