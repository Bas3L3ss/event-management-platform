import Container from "@/components/Container";
import EventsDisplay from "@/components/EventsDisplay";
import MyEventsDisplay from "@/components/MyEventsDisplay";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getEventFromClerkId } from "@/utils/actions/eventsActions";
import React from "react";

async function MyEventsPage() {
  const clerkID = authenticateAndRedirect();
  const events = await getEventFromClerkId(clerkID);

  return (
    <Container>
      <MyEventsDisplay clerkID={clerkID} eventsData={events} />
    </Container>
  );
}

export default MyEventsPage;
