import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { EventType } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EventTypeStep() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Watch the eventType field to show selection
  const selectedType = watch("eventType");

  const filteredEventTypes = Object.values(EventType).filter((type) =>
    type
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^\w/, (c: string) => c.toUpperCase())
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Choose Event Type</h2>
      <Input
        type="text"
        placeholder="Search event types..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 gap-4">
          {filteredEventTypes.map((type) => (
            <motion.label
              key={type}
              htmlFor={type}
              whileTap={{ scale: 0.98 }}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedType === type
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                {...register("eventType", {
                  required: "Please select an event type",
                })}
                value={type}
                id={type}
                className="hidden"
              />
              <label
                htmlFor={type}
                className="block   w-full h-full cursor-pointer capitalize"
              >
                {type.toLowerCase().replace(/_/g, " ")}
              </label>
            </motion.label>
          ))}
        </div>
      </ScrollArea>
      {errors.eventType && (
        <p className="text-destructive text-sm mt-2">
          {errors.eventType.message as string}
        </p>
      )}
    </div>
  );
}
