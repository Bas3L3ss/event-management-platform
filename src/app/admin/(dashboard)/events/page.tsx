import { EventsDataTable } from "@/components/EventsTable";
import Title from "@/components/Title";
import { getAllInAdminPageEvents } from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import React from "react";

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
