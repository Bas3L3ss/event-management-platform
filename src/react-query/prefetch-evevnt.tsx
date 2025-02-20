import { QueryClient } from "@tanstack/react-query";

interface PrefetchConfig {
  search?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
  isFeatured?: string;
  ratingFrom?: string;
}

export async function prefetchEvents(
  queryClient: QueryClient,
  config: PrefetchConfig = {},
  pages = 2
) {
  const fetchPage = async (cursor: string) => {
    const params = new URLSearchParams({ cursor });

    if (config.search) params.append("search", config.search);
    if (config.type) params.append("type", config.type);
    if (config.minPrice) params.append("minPrice", config.minPrice);
    if (config.maxPrice) params.append("maxPrice", config.maxPrice);
    if (config.ratingFrom) params.append("ratingFrom", config.ratingFrom);

    if (config.dateFrom instanceof Date && !isNaN(config.dateFrom.getTime())) {
      params.append("dateFrom", config.dateFrom.toISOString());
    }

    if (config.dateTo instanceof Date && !isNaN(config.dateTo.getTime())) {
      params.append("dateTo", config.dateTo.toISOString());
    }

    if (config.status) params.append("status", config.status);
    if (config.isFeatured)
      params.append("isFeatured", String(config.isFeatured));

    const baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"; // Get base URL
    const url = `${baseURL}/events?${params.toString()}`; // Prepend base URL

    try {
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`HTTP error! Status: ${res.status}`);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };

  let lastPage = await fetchPage("");
  let pagesData = [lastPage];

  for (let i = 1; i < pages && lastPage.nextId; i++) {
    try {
      lastPage = await fetchPage(lastPage.nextId);
      pagesData.push(lastPage);
    } catch (error) {
      console.error("Error fetching page:", error);
      break;
    }
  }

  const prefetchedData = {
    pages: pagesData,
    pageParams: pagesData.map((_, index) =>
      index === 0 ? "" : pagesData[index - 1].nextId
    ),
  };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["events", config],
    queryFn: ({ pageParam = "" }) => fetchPage(pageParam),
    getNextPageParam: (lastPage: { nextId: string }) => lastPage.nextId ?? null,
    initialPageParam: "",
    initialData: prefetchedData,
  });
}
