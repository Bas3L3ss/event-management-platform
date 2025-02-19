import React from "react";

interface DatePrinterProps {
  dateStart: Date;
  dateEnd: Date;
}

export const formatDate = (dateValue: Date) => {
  const date = new Date(dateValue);

  const day = String(date.getDate()).padStart(2, "0"); // padStart for 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} (${hours}:${minutes})`;
};
const DatePrinter: React.FC<DatePrinterProps> = ({ dateStart, dateEnd }) => {
  return (
    <span>
      {formatDate(dateStart)} - {formatDate(dateEnd)}
    </span>
  );
};

export default DatePrinter;
