"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Dispatch } from "react";

type CheckboxInputProps = {
  name: string;
  label: string;
  defaultChecked?: boolean;
  isZod?: boolean;
  setIsChecked?: Dispatch<any>;
};

export default function CheckboxInput({
  name,
  label,
  defaultChecked = false,
  setIsChecked,
  isZod = false,
}: CheckboxInputProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={name}
        defaultChecked={defaultChecked}
        {...(isZod && setIsChecked
          ? {
              name,

              onCheckedChange: (e) => {
                setIsChecked(e);
              },
            }
          : { name })}
      />
      <label
        htmlFor={name}
        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
      >
        {label}
      </label>
    </div>
  );
}
