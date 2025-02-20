import {
  getCommentsLength,
  getLatestFeaturedEvent,
  getOneLatestFeaturedEvent,
} from "@/utils/actions/eventsActions";
import Container from "./Container";
import Title from "./Title";
import OneFeaturedEvent from "./OneFeaturedEvent";
import { Suspense } from "react";
import { CarouselFeatured } from "./CarouselFeatured";
import { Skeleton } from "./ui/skeleton";

const LoadingCarousel = () => (
  <div className="w-full h-[400px] animate-pulse bg-muted rounded-lg" />
);

const LoadingFeaturedEvent = () => (
  <div className="grid lg:grid-cols-2 gap-8 mb-16">
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-32 w-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
    <Skeleton className="h-[400px] w-full rounded-lg" />
  </div>
);

async function MainFeaturedEvent() {
  const oneFeaturedEvent = await getOneLatestFeaturedEvent();
  if (!oneFeaturedEvent) return null;

  const oneEventsCommentsLength = await getCommentsLength(oneFeaturedEvent.id);

  return (
    <>
      <Title
        title="Most Recent Featured Event"
        className="text-4xl font-bold mb-8 text-center"
      />
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
        <Suspense fallback={<LoadingFeaturedEvent />}>
          <MainFeaturedEvent />
        </Suspense>
        <Suspense fallback={<LoadingCarousel />}>
          <OtherFeaturedEvents />
        </Suspense>
      </Container>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L48 8.96551C96 17.931 192 35.8621 288 44.8276C384 53.7931 480 53.7931 576 53.7931C672 53.7931 768 53.7931 864 62.7586C960 71.7241 1056 89.6552 1152 98.6207C1248 107.586 1344 107.586 1392 107.586L1440 107.586V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </div>
  );
}
