import { LIMIT } from "@/constants/values";
import prisma from "@/utils/db";
import { QueryClient } from "@tanstack/react-query";

interface PrefetchConfigEmpty {
  search?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  dateFrom?: null;
  dateTo?: null;
  status?: string;
  isFeatured?: string;
  ratingFrom?: string;
}

export async function prefetchEvents(
  queryClient: QueryClient,
  config: PrefetchConfigEmpty = {},
  pages = 2
) {
  const fetchPage = async (cursor: string) => {
    try {
      const events = await prisma.event.findMany({
        take: LIMIT,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { dateStart: "desc" },
      });

      return {
        events,
        nextId: events.length === LIMIT ? events[events.length - 1].id : null,
      };
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
    queryKey: [
      "events",
      {
        search: "",
        type: "",
        minPrice: "",
        maxPrice: "",
        status: "",
        isFeatured: "",
        ratingFrom: "",
      },
    ],
    queryFn: ({ pageParam = "" }) => fetchPage(pageParam!),
    getNextPageParam: (lastPage: { nextId: string | null }) =>
      lastPage.nextId ?? null,
    initialPageParam: "",
    initialData: prefetchedData,
  });
}
