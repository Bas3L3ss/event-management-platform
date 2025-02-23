import React, { Suspense } from "react";
import Container from "@/components/Container";

import { Metadata } from "next";
import { getEventById } from "@/utils/actions/eventsActions";
import { formatDate } from "@/components/DatePrinter";
import MainPage from "./_component/MainPage";
import dynamic from "next/dynamic";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";

const RecommendationCarousel = dynamic(
  () => import("@/components/RecomendationCarousel")
);
export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { event, author } = await getEventById(id);
  if (!event) {
    return {
      title: "Event Not Found | Event Management platform",
      description: "The requested event could not be found.",
    };
  }

  const startDate = formatDate(event.dateStart);
  const endDate = formatDate(event.dateEnd);

  return {
    title: `${event.eventName} | Event Management platform`,
    description: `${event.eventDescription} made by ${author?.userName}`,
    openGraph: {
      title: event.eventName,
      description: event.eventDescription,
      images: event.eventImgOrVideoFirstDisplay
        ? [
            {
              url: event.eventImgOrVideoFirstDisplay,
              width: 1200,
              height: 630,
              alt: event.eventName,
            },
          ]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: event.eventName,
      description: event.eventDescription,
      images: event.eventImgOrVideoFirstDisplay
        ? [event.eventImgOrVideoFirstDisplay]
        : [],
    },
    other: {
      "event:start_date": startDate,
      "event:end_date": endDate,
      "event:location": event.eventLocation,
      "event:price": event.eventTicketPrice.toString(),
      "event:type": event.type,
      "event:author": author?.userName ?? "anonymous  ",
    },
  };
}

const OneEventPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <Container className="py-10 space-y-12">
      <Suspense
        fallback={<SkeletonLoading variant={LoadingVariant.EVENTPAGE} />}
      >
        <MainPage params={{ id }} />
      </Suspense>
      <RecommendationCarousel className="mt-16" id={id} />
    </Container>
  );
};

export default OneEventPage;
