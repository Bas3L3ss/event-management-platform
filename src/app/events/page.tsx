import { prefetchEvents } from "@/react-query/prefetch-evevnt";
import React from "react";
import EventPage from "./_component/EventPage";
import { QueryClient } from "@tanstack/react-query";

export const generateMetadata = async () => {
  const queryClient = new QueryClient();

  await prefetchEvents(queryClient, {
    // Default filters if any
  });

  return {
    title: "Events",
  };
};

const Page = () => {
  return <EventPage />;
};

export default Page;
