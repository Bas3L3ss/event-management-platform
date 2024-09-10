// pages/featured-events.tsx

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getCommentsLength,
  getLatestFeaturedEvent,
  getOneLatestFeaturedEvent,
} from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import OneFeaturedEvent, { star } from "./OneFeaturedEvent";
import Container from "./Container";
import Title from "./Title";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedEventsPage() {
  // Fetch multiple featured events
  const featuredEvents: Event[] = await getLatestFeaturedEvent(5);
  if (!featuredEvents || featuredEvents.length === 0)
    return <p>No featured events available.</p>;

  // Fetch the most up-to-date featured event
  const oneFeaturedEvent = await getOneLatestFeaturedEvent();
  if (!oneFeaturedEvent) return <p>No latest featured event available.</p>;

  const oneEventsCommentsLength = getCommentsLength(oneFeaturedEvent.id);

  return (
    <Container className="mt-20 ">
      <Title title="Most Recent Featured Event" />
      <OneFeaturedEvent
        commentsLength={oneEventsCommentsLength}
        featuredEvent={oneFeaturedEvent}
      />
      <Title
        title={`Other Featured Events - ${featuredEvents.length} events`}
      />
      <ul>
        <CarouselFeatured featuredEvents={featuredEvents} />
      </ul>
    </Container>
  );
}

export function CarouselFeatured({
  featuredEvents,
}: {
  featuredEvents: Event[];
}) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full "
    >
      <CarouselContent>
        {featuredEvents.map((el, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <li className="p-1">
              <Link href={`/events/${el.id}`}>
                <Card>
                  <CardContent className="flex flex-col aspect-square justify-center-center  p-6">
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
                        {Array.from(
                          { length: Math.floor(el.rating) },
                          (_, index) => (
                            <span key={index}>{star}</span>
                          )
                        )}
                      </span>
                      - <span className="font-semibold">{el.rating} / 5</span>
                    </p>
                    <p className="">{el.eventDescription}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="hidden lg:block" />
      <CarouselNext className="hidden lg:block" />
    </Carousel>
  );
}
