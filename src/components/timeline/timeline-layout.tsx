"use client";

import React, { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
} from "./Timeline";
import { Event } from "@prisma/client";

interface TimelineLayoutProps {
  items: Event[]; // Replace any[] with the actual type of items.
}
export const TimelineLayout = ({ items }: TimelineLayoutProps) => {
  return (
    <Timeline>
      {items.map((el) => {
        return <IndividualTimeLine key={el.id} event={el} />;
      })}
    </Timeline>
  );
};
const IndividualTimeLine = ({ event }: { event: Event }) => {
  const [dateCreated, setDateCreated] = useState<string>();
  useEffect(() => {
    setDateCreated(new Date(event.createdAt).toLocaleString());
  }, [setDateCreated, event.createdAt]);
  return (
    <TimelineItem>
      <TimelineConnector />
      <TimelineHeader>
        <TimelineTime>{dateCreated}</TimelineTime>
        <TimelineIcon />
        <TimelineTitle>{event.eventName}</TimelineTitle>
      </TimelineHeader>
      <TimelineContent>
        <TimelineDescription>{event.eventDescription}</TimelineDescription>
      </TimelineContent>
    </TimelineItem>
  );
};
