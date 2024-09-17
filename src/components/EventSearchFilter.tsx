// components/EventSearchFilter.tsx

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
import { FilterIcon, FilterXIcon } from "lucide-react";
import { Label } from "./ui/label";
import { redirect } from "next/navigation";
import { deepEqual } from "@/utils/utils";

type EventSearchFilterProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
  filters: FiltersType;
  isDefValueAndFiltersEquals: boolean;
};

const EventSearchFilter = ({
  searchTerm,
  setSearchTerm,
  setFilters,
  filters,
  isDefValueAndFiltersEquals,
}: EventSearchFilterProps) => {
  const [isResetable, setIsResetable] = useState(false);
  useEffect(() => {
    if (isResetable) {
      setIsResetable(false);

      redirect("/events");
    }
  }, [isResetable]);
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
            <Label htmlFor="minDate">Date start</Label>
            <Input
              id="minDate"
              className=" w-auto"
              type="date"
              value={filters.minDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minDate: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="maxDate">Date end</Label>
            <Input
              id="maxDate"
              className=" w-auto"
              type="date"
              value={filters.maxDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxDate: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="Ratings">Rating from</Label>
            <Input
              id="Ratings"
              className=" w-auto"
              min={0}
              max={5}
              type="number"
              placeholder="Min Rating"
              value={filters.minRating}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minRating: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div className="ml-auto mt-auto">
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
                        if (status == "NOT_CONFIRMED") return null;
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
                  console.log(deepEqual(filters, defaultValue));
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
                      setIsResetable(true);
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
