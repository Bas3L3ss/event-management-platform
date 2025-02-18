"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import DatetimePickerPlaceholder from "../DateTimePickerPlaceHolder";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type DateTimePickerProps = {
  register?: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  watch?: UseFormWatch<any>;
  isZod?: boolean;
};

const DateTimePicker = ({
  register,
  setValue,
  watch,
  isZod = false,
}: DateTimePickerProps) => {
  const watchStartDate = watch ? watch("dateStart") : undefined;
  const watchEndDate = watch ? watch("dateEnd") : undefined;

  let InitialDateStart: Date | undefined = undefined;
  let InitialDateEnd: Date | undefined = undefined;

  if (watchStartDate) {
    InitialDateStart = new Date(watchStartDate);
  }
  if (watchEndDate) {
    InitialDateEnd = new Date(watchEndDate);
  }

  const [startDate, setStartDate] = useState<Date | undefined>(
    InitialDateStart != undefined ? InitialDateStart : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    InitialDateEnd != undefined ? InitialDateEnd : undefined
  );
  // Format date to yyyy-MM-ddThh:mm
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return "";

    // Adjust for timezone offset
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzOffset);

    return localDate.toISOString().slice(0, 16);
  };

  // Initialize state from form values if they exist
  useEffect(() => {
    if (watchStartDate) {
      const date = new Date(watchStartDate);
      if (!isNaN(date.getTime())) {
        setStartDate(date);
      }
    }
    if (watchEndDate && typeof watchEndDate === "string") {
      const date = new Date(watchEndDate);
      if (!isNaN(date.getTime())) {
        setEndDate(date);
      }
    }
  }, []); // Run only on mount to initialize

  useEffect(() => {
    if (startDate && setValue) {
      setValue("dateStart", startDate, {
        shouldValidate: false,
      });
    }
  }, [startDate, setValue]);

  useEffect(() => {
    if (endDate && setValue) {
      setValue("dateEnd", endDate, {
        shouldValidate: false,
      });
    }
  }, [endDate, setValue]);

  return (
    <div className="grid gap-6 sm:grid-cols-2 mb-6">
      <div className="flex flex-col">
        <Label
          htmlFor="dateStart"
          className="mb-2 block text-sm font-medium text-primary"
        >
          Start Date
        </Label>
        <DatetimePickerPlaceholder
          placeholder="Start date"
          date={startDate}
          className="w-full"
          setDate={setStartDate}
        />
        {isZod && register && (
          <input
            type="datetime-local"
            className=" opacity-0   pointer-events-none   "
            {...register("dateStart", {
              required: "Please include a start date for your event",
              validate: {
                futureDate: (value) => {
                  if (!value) return true;
                  const date = new Date(value);
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(0, 0, 0, 0);

                  return (
                    date >= tomorrow ||
                    "Start date must be at least 1 day ahead from now"
                  );
                },
              },
            })}
            value={formatDateForInput(startDate)}
          />
        )}
      </div>
      <div className="flex flex-col">
        <Label
          htmlFor="dateEnd"
          className="mb-2 block text-sm font-medium text-primary"
        >
          End Date
        </Label>
        <DatetimePickerPlaceholder
          placeholder="End date"
          date={endDate}
          className="w-full"
          setDate={setEndDate}
        />
        {isZod && register && (
          <input
            type="datetime-local"
            className=" opacity-0   pointer-events-none   "
            {...register("dateEnd", {
              required: "Please include an end date for your event",
              validate: {
                afterStart: (value) => {
                  if (!value) return true;
                  const endDate = new Date(value);
                  const startDateValue = watch?.("dateStart");

                  if (!startDateValue) return true;

                  const startDate = new Date(startDateValue);
                  return (
                    endDate > startDate ||
                    "End date must be after the start date"
                  );
                },
              },
            })}
            value={formatDateForInput(endDate)}
          />
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
