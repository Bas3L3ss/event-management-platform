import OtherProfilePage from "@/components/OtherProfilePage";
import { getUserLengthByClerkId } from "@/utils/actions/eventsActions";
import {
  getUniqueEventTypes,
  getUserFromDataBase,
} from "@/utils/actions/usersActions";
import { EventType } from "@prisma/client";
import React from "react";

async function SomeoneProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const eventLength = await getUserLengthByClerkId(id);
  const userFromDataBase = await getUserFromDataBase(id);
  const typeUserSubmitted = await getUniqueEventTypes(id);
  let typeUserSubmittedArr: EventType[] = [];
  const typeUserSubmittedSet = new Set(typeUserSubmitted).forEach((el) =>
    typeUserSubmittedArr.push(el as EventType)
  );

  return (
    <OtherProfilePage
      eventLength={eventLength}
      typeUserSubmitted={typeUserSubmittedArr}
      userFromDataBase={userFromDataBase!}
    />
  );
}

export default SomeoneProfilePage;
