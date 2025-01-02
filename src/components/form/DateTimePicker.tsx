"use client";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import DatetimePickerPlaceholder from "../DateTimePickerPlaceHolder";

const DateTimePicker = () => {
  const [minDate, setMinDate] = useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined);
  const startRes = useRef<HTMLInputElement>(null);
  const endRes = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!startRes.current || !endRes.current) return;

    const formatDateTime = (date: Date | undefined) => {
      if (!date) return "";
      // Format: YYYY-MM-DDThh:mm
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        "T" +
        String(date.getHours()).padStart(2, "0") +
        ":" +
        String(date.getMinutes()).padStart(2, "0")
      );
    };

    startRes.current.value = formatDateTime(minDate);
    endRes.current.value = formatDateTime(maxDate);
  }, [minDate, maxDate]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    setMinDate(newDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    setMaxDate(newDate);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 mb-6">
      <div>
        <Label
          htmlFor="dateStart"
          className="mb-2 block text-sm font-medium text-primary"
        >
          Start Date
        </Label>
        <DatetimePickerPlaceholder
          placeholder="Start date"
          date={minDate}
          className="w-full"
          setDate={setMinDate}
        />
        <Input
          id="dateStart"
          type="datetime-local"
          name="dateStart"
          className="hidden"
          ref={startRes}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <Label
          htmlFor="dateEnd"
          className="mb-2 block text-sm font-medium text-primary"
        >
          End Date
        </Label>
        <DatetimePickerPlaceholder
          placeholder="End date"
          date={maxDate}
          setDate={setMaxDate}
          className="w-full"
        />
        <Input
          id="dateEnd"
          type="datetime-local"
          name="dateEnd"
          className="hidden"
          ref={endRes}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};
export default DateTimePicker;
