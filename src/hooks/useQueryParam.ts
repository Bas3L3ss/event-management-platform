import { useEffect, useState } from "react";
import { EventStatus, EventType } from "@prisma/client"; // Import these as needed

export type FiltersType = {
  eventType?: EventType | string;
  status?: EventStatus | string;
  isFeatured?: boolean;
  minDate?: string;
  maxDate?: string;
  minRating?: number;
};

export const useFilters = (): FiltersType => {
  const [filters, setFilters] = useState<FiltersType>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const eventType = params.get("eventtype") as EventType | string;
    const status = params.get("status") as EventStatus | string;
    const isFeatured = params.get("isfeatured") === "true";
    const minDate = params.get("mindate") || "";
    const maxDate = params.get("maxdate") || "";
    const minRating = params.get("minrating")
      ? Number(params.get("minrating"))
      : 0;

    setFilters({
      eventType: eventType !== null ? eventType : "",
      status: status !== null ? status : "",
      isFeatured: isFeatured || undefined,
      minDate: minDate,
      maxDate: maxDate,
      minRating: minRating,
    });
  }, []);

  return filters;
};
