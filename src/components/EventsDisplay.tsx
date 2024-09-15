// components/EventsPage.tsx
"use client";
import { useState } from "react";
import EventSearchFilter from "./EventSearchFilter";
import { Event, EventStatus, EventType } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { star } from "./OneFeaturedEvent";
import Title from "./Title";
import { Button } from "./ui/button";
import DatePrinter from "./DatePrinter";

export type FiltersType = {
  eventType?: EventType | undefined;
  status?: EventStatus | undefined;
  isFeatured?: boolean | undefined;
  minDate?: string | undefined;
  maxDate?: string | undefined;
  minRating?: number | undefined;
};

export const defaultValue = {
  eventType: undefined,
  status: undefined,
  isFeatured: false,
  minDate: "",
  maxDate: "",
  minRating: 0,
};

const EventsDisplay = ({ eventsData }: { eventsData: Event[] }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FiltersType>(defaultValue);
  const [events, setEvents] = useState<Event[]>([...eventsData]);

  const handleSearch = async () => {
    try {
      const response = await fetch("/api/eventsHandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchTerm,
          filters,
        }),
      });
      const fetchedEvents = await response.json();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div>
      <EventSearchFilter
        onSearch={handleSearch}
        filters={filters}
        searchTerm={searchTerm}
        setFilters={setFilters}
        setSearchTerm={setSearchTerm}
      />

      <Title
        title={`Events - ${events.length} event(s) `}
        className="mb-2 md:mb-5 mt-5"
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-1 ">
        {events.length > 0 ? (
          events.map((event) => <IndividualEvent el={event} key={event.id} />)
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  );
};

const IndividualEvent = ({ el }: { el: Event }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const maxLength = 40;
  const toggleText = () => {
    setIsTextExpanded(!isTextExpanded);
  };

  return (
    <div>
      <Card className="">
        <CardContent className="flex flex-col  justify-center-center  p-6">
          <p className="text-xs text-gray-600">
            <DatePrinter dateEnd={el.dateEnd} dateStart={el.dateStart} />
          </p>
          <p className="mb-2 lg:text-2xl font-semibold text-lg">
            {el.eventName}
          </p>
          <p className="mb-2 lg:text-base font-light text-gray-500 text-sm">
            Host: {el.hostName} - genre:
            {el.type.toLowerCase()}
          </p>
          <Image
            src={""}
            // src={`${el.eventImg}`}
            alt={`${el.eventName}`}
          />
          <p className="mt-3 text-sm gap-2 flex">
            <span className="flex">
              {Array.from({ length: Math.floor(el.rating) }, (_, index) => (
                <span key={index}>{star}</span>
              ))}
            </span>
            -{" "}
            <span className="font-semibold">{el.rating.toFixed(1)} / 5.0</span>
          </p>
          {el.eventDescription.length <= maxLength ? (
            <p>{el.eventDescription}</p>
          ) : (
            <div>
              <p>
                {isTextExpanded
                  ? el.eventDescription
                  : el.eventDescription.substring(0, maxLength) + "..."}
              </p>

              <button onClick={toggleText} className="text-blue-500">
                {isTextExpanded ? "See Less" : "See More"}
              </button>
            </div>
          )}

          <div className="mt-10 flex gap-2">
            <Button asChild size={"lg"}>
              <Link href={`${el.reservationTicketLink}`}>Book ticket</Link>
            </Button>
            <Button variant={"outline"} size={"lg"}>
              <Link href={`/events/${el.id}`}>Review Event</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default EventsDisplay;
