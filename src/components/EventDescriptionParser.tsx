import { cn } from "@/lib/utils";
import parse from "html-react-parser";

const EventDescriptionParser = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => {
  return (
    <div className={cn("custom-description", className)}>
      {parse(description)}
    </div>
  );
};

export default EventDescriptionParser;
