import { cn } from "@/lib/utils";
import React from "react";

function Title({ title, className }: { title: string; className?: string }) {
  return (
    <p className={cn(`font-bold text-2xl  mb-10 md:mb-20 `, className)}>
      {title}
    </p>
  );
}

export default Title;
