"use client";
import React, { useState } from "react";
import { DateTimePicker } from "@/components/ui/datetime-picker";

const DatetimePickerPlaceholder = ({
  placeholder,
}: {
  placeholder: string;
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <DateTimePicker
      value={date}
      onChange={setDate}
      placeholder={placeholder}
      className="w-72"
    />
  );
};

export default DatetimePickerPlaceholder;
