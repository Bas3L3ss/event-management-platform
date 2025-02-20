"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

interface PrefetchLinkProps extends React.ComponentProps<typeof Link> {
  queryKey: string[]; // Query key for prefetching
  queryFn: () => Promise<any>; // Function to fetch data
}

export default function PrefetchLink({
  queryKey,
  queryFn,
  ...props
}: PrefetchLinkProps) {
  const queryClient = useQueryClient();

  const prefetchData = async () => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  };

  return <Link {...props} onMouseEnter={prefetchData} />;
}
