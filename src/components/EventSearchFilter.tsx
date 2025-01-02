import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { defaultValue, FiltersType } from "./EventsDisplay";
import { EventStatus, EventType } from "@prisma/client";
import { Input } from "./ui/input";

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
} from "./ui/dropdown-menu";
import { FilterIcon, FilterXIcon, PlusIcon } from "lucide-react";
import { Label } from "./ui/label";
import { redirect } from "next/navigation";
import SkeletonLoading from "./SkeletonLoading";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import DatetimePickerPlaceholder from "./DateTimePickerPlaceHolder";
import { LoadingVariant } from "@/constants/values";

type EventSearchFilterProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setFilters: Dispatch<SetStateAction<FiltersType | null>>;
  filters: FiltersType | null;
  isDefValueAndFiltersEquals: boolean;
  isEditPage?: boolean;
};

const EventSearchFilter = ({
  searchTerm,
  setSearchTerm,
  setFilters,
  filters,
  isEditPage = false,
  isDefValueAndFiltersEquals,
}: EventSearchFilterProps) => {
  const [isResettable, setIsResettable] = useState(false);
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);
  useEffect(() => {
    if (isResettable) {
      setIsResettable(false);
      if (isEditPage) redirect("/events/myevents");
      redirect("/events");
    }
  }, [isResettable]);
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      maxDate: maxDate?.toISOString(),
      minDate: minDate?.toISOString(),
    }));
  }, [minDate, maxDate]);
  if (!filters)
    return (
      <div>
        <SkeletonLoading variant={LoadingVariant.SEARCH} />
      </div>
    );
  return (
    <form className="space-y-4 mt-5">
      <div className="flex gap-3">
        <Input
          type="search"
          placeholder="Search by event name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-class"
        />
      </div>

      <div className=" flex flex-wrap gap-3 justify-between">
        {/* Filter options */}
        <div className="flex gap-3 flex-wrap">
          <div>
            <Label htmlFor="minDate">Date from</Label>
            <div>
              <DatetimePickerPlaceholder
                date={minDate}
                className="w-64"
                setDate={setMinDate}
                placeholder="Date start"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="maxDate">Date to</Label>
            <div>
              <DatetimePickerPlaceholder
                date={maxDate}
                className="w-64"
                setDate={setMaxDate}
                placeholder="Date end"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="Ratings">Rating from</Label>
            <Input
              id="Ratings"
              className=" w-auto"
              min={0}
              max={5}
              type="number"
              value={filters.minRating}
              placeholder="0"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: Number(e.target.value),
                }))
              }
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
                {!isDefValueAndFiltersEquals ? <FilterXIcon /> : <FilterIcon />}
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
                      value={filters.eventType}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          eventType: e.target.value as EventType,
                        }))
                      }
                    >
                      <option selected value="">
                        All Event Types
                      </option>
                      {Object.values(EventType).map((type) => (
                        <option className="capitalize" key={type} value={type}>
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
                      value={filters.status}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: e.target.value as EventStatus,
                        }))
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
                className={`${
                  filters.isFeatured ? "bg-green-500 hover:!bg-green-600" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const isFeaturedCheck =
                    filters.isFeatured === true ? undefined : true;
                  setFilters((prev) => ({
                    ...prev,
                    isFeatured: isFeaturedCheck,
                  }));
                }}
              >
                Featured
                <DropdownMenuShortcut></DropdownMenuShortcut>
              </DropdownMenuItem>

              {!isDefValueAndFiltersEquals && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="bg-red-800 hover:!bg-red-900"
                    onClick={(e) => {
                      e.preventDefault();
                      setFilters(defaultValue);
                      setMaxDate(undefined);
                      setMinDate(undefined);
                      setIsResettable(true);
                    }}
                  >
                    Clear all filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </form>
  );
};

export default EventSearchFilter;
