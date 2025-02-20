"use client";
import PrefetchLink from "@/react-query/prefetch";
import { getEventById } from "@/utils/actions/eventsActions";
import { MessageSquare } from "lucide-react";
import React from "react";

const OneFeaturedEventPrefetchLink = ({ eventId }: { eventId: string }) => {
  return (
    <PrefetchLink
      queryKey={["event", eventId]}
      queryFn={() => getEventById(eventId)}
      className="flex gap-1 flex-nowrap"
      href={`/events/${eventId}`}
    >
      <MessageSquare className="w-5 h-5 mr-2" />
      Book Ticket
    </PrefetchLink>
  );
};

export default OneFeaturedEventPrefetchLink;
