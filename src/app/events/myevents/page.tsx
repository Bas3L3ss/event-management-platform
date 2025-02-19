"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { Event, EventStatus, EventType } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/components/Container";
import Title from "@/components/Title";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import { IndividualEvent } from "@/components/IndividualEvent";
import { FilterIcon, FilterXIcon, Loader2, PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatetimePickerPlaceholder from "@/components/DateTimePickerPlaceHolder";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@clerk/nextjs";

export default function MyEventsPage() {
  const { ref, inView } = useInView({ threshold: 0.5 });
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasQueryParams = searchParams.toString().length > 0;
  const isEditPage = true;
  const { user: clerkuser } = useUser();

  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom") || "")
      : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo") || "")
      : undefined
  );
  // Get filters from URL params instead of state
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const status = searchParams.get("status") ?? "";
  const ratingFrom = searchParams.get("ratingFrom") ?? "";
  const isFeatured = searchParams.get("isFeatured") ?? "";

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`?${params.toString()}`);
  };

  const fetchEvents = async ({ pageParam = "" }) => {
    const params = new URLSearchParams({ cursor: pageParam });
    if (search) params.append("search", search);
    if (type) params.append("type", type);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (ratingFrom) params.append("ratingFrom", ratingFrom);
    if (dateFrom) params.append("dateFrom", dateFrom.toISOString());
    if (dateTo) params.append("dateTo", dateTo.toISOString());
    if (status) params.append("status", status);
    if (isFeatured) params.append("isFeatured", isFeatured);
    if (clerkuser) {
      params.append("clerkId", clerkuser.id);
    } else {
      return;
    }
    const res = await axios.get(`/api/events?${params.toString()}`);
    return res.data;
  };

  const {
    isLoading,
    isError,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "events",
      {
        search,
        type,
        minPrice,
        maxPrice,
        dateFrom,
        dateTo,
        status,
        isFeatured,
        ratingFrom,
        userid: clerkuser?.id,
      },
    ],
    queryFn: fetchEvents,
    getNextPageParam: (lastPage) => lastPage?.nextId ?? null,
    initialPageParam: "",
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      events: data.pages.reduce((acc: Event[], page) => {
        const uniqueEvents = page.events.filter(
          (event: Event) => !acc.some((e) => e.id === event.id)
        );
        return [...acc, ...uniqueEvents];
      }, []),
    }),
  });

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (dateFrom) {
      updateFilters({ dateFrom: dateFrom.toISOString() });
    }
    if (dateTo) {
      updateFilters({ dateTo: dateTo.toISOString() });
    }
  }, [dateFrom, dateTo]);
  return (
    <Container className="mt-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Events</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="space-y-4 mt-5">
        <div className="flex gap-3">
          <Input
            type="search"
            placeholder="Search by event name..."
            defaultValue={search}
            onChange={(e) => {
              updateFilters({ search: e.target.value });
            }}
          />
        </div>

        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex gap-3 flex-wrap">
            <div>
              <Label htmlFor="minDate">Date from</Label>
              <div>
                <DatetimePickerPlaceholder
                  date={dateFrom}
                  className="w-64"
                  setDate={setDateFrom}
                  placeholder="Date start"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="maxDate">Date to</Label>
              <div>
                <DatetimePickerPlaceholder
                  date={dateTo}
                  className="w-64"
                  placeholder="Date end"
                  setDate={setDateTo}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="Ratings">Rating from</Label>
              <Input
                id="Ratings"
                className="w-auto"
                min={0}
                max={5}
                type="number"
                value={ratingFrom}
                placeholder="0"
                onChange={(e) => {
                  const rating = parseInt(e.target.value);
                  if (rating > 5 || rating < 0) {
                    return;
                  }
                  updateFilters({ ratingFrom: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="ml-auto mt-auto gap-2 flex">
            {isEditPage && (
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Link
                      className=" hover:text-blue-400"
                      href={"/events/myevents/addevents"}
                    >
                      <PlusIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start" alignOffset={2}>
                    Add new event.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="">
                <span className="font-normal  text-xs   hover:text-blue-400">
                  {hasQueryParams ? <FilterXIcon /> : <FilterIcon />}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 ">
                <DropdownMenuLabel>Filter Events</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Event Types</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <select
                        value={type}
                        onChange={(e) =>
                          updateFilters({ type: e.target.value })
                        }
                      >
                        <option value="">All Event Types</option>
                        {Object.values(EventType).map((type) => (
                          <option
                            className="capitalize"
                            key={type}
                            value={type}
                          >
                            {type.toLowerCase().replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Event Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <select
                        className=" "
                        value={status}
                        onChange={(e) =>
                          updateFilters({ status: e.target.value })
                        }
                      >
                        <option selected value="">
                          All Statuses
                        </option>
                        {Object.values(EventStatus).map((status) => {
                          if (status == "NOT_CONFIRMED" && !isEditPage) return;
                          return (
                            <option
                              className="capitalize"
                              key={status}
                              value={status}
                            >
                              {status.toLowerCase().replace(/_/g, " ")}
                            </option>
                          );
                        })}
                      </select>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={`mb-2 ${
                    isFeatured === "true"
                      ? "bg-green-500 hover:!bg-green-600 "
                      : ""
                  }`}
                  onClick={() =>
                    updateFilters({
                      isFeatured: isFeatured === "true" ? "" : "true",
                    })
                  }
                >
                  Featured
                  <DropdownMenuShortcut></DropdownMenuShortcut>
                </DropdownMenuItem>
                {hasQueryParams && (
                  <DropdownMenuItem
                    className="bg-red-800 hover:!bg-red-900"
                    onClick={() => {
                      updateFilters({
                        search: "",
                        type: "",
                        minPrice: "",
                        maxPrice: "",
                        dateFrom: "",
                        dateTo: "",
                        status: "",
                        ratingFrom: "",
                        isFeatured: "",
                      });
                    }}
                  >
                    Clear all filters
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>
      <Title
        title={`Events`}
        className="my-6 text-2xl font-bold text-primary"
      />

      {isError || data?.events.length == 0 ? (
        <p className="text-center text-gray-500">No events found.</p>
      ) : null}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mb-10 ">
        {data?.events.map((event: Event) => (
          <IndividualEvent key={event.id} event={event} />
        ))}
      </section>

      {isFetchingNextPage || isLoading ? (
        <SkeletonLoading variant={LoadingVariant.CARD} />
      ) : null}

      {!hasNextPage ? (
        <p className="text-center text-gray-500">End of the list.</p>
      ) : null}
      <Separator ref={ref} className="mt-5" />
    </Container>
  );
}
