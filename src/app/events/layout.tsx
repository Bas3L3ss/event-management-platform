import { prefetchEvents } from "@/react-query/prefetch-event";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const query = new QueryClient();
  await prefetchEvents(query, {});
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <main>{children}</main>;
    </HydrationBoundary>
  );
};

export default Layout;
