import { cn } from "@/lib/utils";
import React from "react";

function Title({ title, className }: { title: string; className?: string }) {
  return (
    <p className={cn(`font-bold text-2xl  mb-5 md:mb-10 `, className)}>
      {title}
    </p>
  );
}

export default Title;
