import Container from "@/components/Container";
import EventsDisplay from "@/components/EventsDisplay";
import MyEventsDisplay from "@/components/MyEventsDisplay";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { authenticateAndRedirect } from "@/utils/actions/clerkFunc";
import { getEventFromClerkId } from "@/utils/actions/eventsActions";
import React from "react";

async function MyEventsPage() {
  const clerkID = authenticateAndRedirect();
  const events = await getEventFromClerkId(clerkID);

  return (
    <Container className="mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Events</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <MyEventsDisplay clerkID={clerkID} eventsData={events} />
    </Container>
  );
}

export default MyEventsPage;
