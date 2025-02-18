import Title from "@/components/Title";
import { getAllInAdminPageEvents } from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the client-only component and specify the type
const EventsDataTable = dynamic(
  () => import("@/components/EventsTable").then((mod) => mod.EventsDataTable),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);

async function AdminEventsPage() {
  const events: Event[] = await getAllInAdminPageEvents();
  return (
    <div className="mt-10">
      <Title title="Events" className=" md:mb-2 mb-0" />
      <EventsDataTable data={events} />
    </div>
  );
}

export default AdminEventsPage;
