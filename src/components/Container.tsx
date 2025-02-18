import React from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "narrow" | "wide" | "full";
type ContainerPadding = "none" | "small" | "medium" | "large";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: ContainerWidth;
  padding?: ContainerPadding;
  as?: React.ElementType;
  id?: string;
}

const widthClasses: Record<ContainerWidth, string> = {
  default: "max-w-6xl xl:max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-8xl",
  full: "max-w-full",
};

const paddingClasses: Record<ContainerPadding, string> = {
  none: "px-0",
  small: "px-4 sm:px-6",
  medium: "px-6 sm:px-8",
  large: "px-8 sm:px-12",
};

export function Container({
  children,
  className,
  width = "default",
  padding = "medium",
  as: Component = "section",
  id,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        widthClasses[width],
        paddingClasses[padding],
        className
      )}
      id={id}
    >
      {children}
    </Component>
  );
}

export default Container;
