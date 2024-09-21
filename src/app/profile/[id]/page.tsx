import OtherProfilePage from "@/components/OtherProfilePage";
import { getUserLengthByClerkId } from "@/utils/actions/eventsActions";
import {
  getUniqueEventTypes,
  getUserFromDataBase,
} from "@/utils/actions/usersActions";
import React from "react";

async function SomeoneProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const eventLength = await getUserLengthByClerkId(id);
  const userFromDataBase = await getUserFromDataBase(id);
  const typeUserSubmitted = await getUniqueEventTypes(id);

  return (
    <OtherProfilePage
      eventLength={eventLength}
      typeUserSubmitted={typeUserSubmitted}
      userFromDataBase={userFromDataBase!}
    />
  );
}

export default SomeoneProfilePage;
