import {
  getCommentsLength,
  getLatestFeaturedEvent,
  getOneLatestFeaturedEvent,
} from "@/utils/actions/eventsActions";
import Container from "./Container";
import Title from "./Title";
import OneFeaturedEvent, { OneFeaturedEventSkeleton } from "./OneFeaturedEvent";
import { Suspense } from "react";
import { CarouselFeatured, CarouselFeaturedSkeleton } from "./CarouselFeatured";
import { Skeleton } from "./ui/skeleton";

async function MainFeaturedEvent() {
  const oneFeaturedEvent = await getOneLatestFeaturedEvent();
  if (!oneFeaturedEvent) return null;

  const oneEventsCommentsLength = await getCommentsLength(oneFeaturedEvent.id);

  return (
    <>
      <OneFeaturedEvent
        commentsLength={oneEventsCommentsLength ? oneEventsCommentsLength : 0}
        featuredEvent={oneFeaturedEvent}
      />
    </>
  );
}

async function OtherFeaturedEvents() {
  const featuredEvents = await getLatestFeaturedEvent(8);
  if (!featuredEvents || featuredEvents.length === 0) return null;

  return (
    <>
      <Title
        title={`Other Featured Events - ${featuredEvents.length} events`}
        className="text-3xl font-semibold mt-16 mb-8 text-center"
      />
      <CarouselFeatured featuredEvents={featuredEvents} />
    </>
  );
}

export default function FeaturedEventsPage() {
  return (
    <div
      id="featured-events"
      className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-br from-background to-primary/10"
    >
      <div className="absolute inset-0 -z-10 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="featured-pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 32V.5H32"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
              ></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#featured-pattern)"></rect>
        </svg>
      </div>
      <Container className="relative z-10">
        <Title
          title="Most Recent Featured Event"
          className="text-4xl font-bold mb-8 text-center"
        />
        <Suspense fallback={<OneFeaturedEventSkeleton />}>
          <MainFeaturedEvent />
        </Suspense>

        <Suspense fallback={<CarouselFeaturedSkeleton />}>
          <OtherFeaturedEvents />
        </Suspense>
      </Container>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 30C120 40 240 50 360 50C480 50 600 40 720 35C840 30 960 30 1080 35C1200 40 1320 50 1440 45V60H0V30Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </div>
  );
}
