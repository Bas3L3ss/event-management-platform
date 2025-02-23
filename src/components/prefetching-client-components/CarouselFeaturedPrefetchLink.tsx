"use client";
import PrefetchLink from "@/react-query/prefetch";
import { getCommentsByEventId } from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import { LinkIcon } from "lucide-react";
import React from "react";

const CarouselFeaturedPrefetchLink = ({ el }: { el: Event }) => {
  return (
    <PrefetchLink
      queryKey={["comments", el.id]}
      queryFn={async () => await getCommentsByEventId(el.id)}
      className="mb-2  inline-flex items-center gap-2"
      href={`/events/${el.id}`}
    >
      <h3 className="text-xl font-semibold line-clamp-2">{el.eventName}</h3>
      <LinkIcon size={16} className="text-blue-600" />
    </PrefetchLink>
  );
};

export default CarouselFeaturedPrefetchLink;
