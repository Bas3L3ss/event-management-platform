"use client";
import React from "react";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { cn } from "@/lib/utils";

const DatetimePickerPlaceholder = ({
  placeholder,
  className,
  date,
  setDate,
}: {
  placeholder: string;
  className?: string;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  date: Date | undefined;
}) => {
  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      placeholder={placeholder}
      className={cn("w-72", className)}
    />
  );
};

export default DatetimePickerPlaceholder;
