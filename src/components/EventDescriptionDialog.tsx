"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventDescriptionParser from "./EventDescriptionParser";
import { ChevronRight } from "lucide-react";

interface EventDescriptionDialogProps {
  description: string;
  className?: string;
}

export function EventDescriptionDialog({
  description,
  className,
}: EventDescriptionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 h-auto font-normal text-muted-foreground hover:text-primary transition-colors"
        >
          View full event's description
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">
            Event Description
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-4 max-h-[calc(80vh-100px)]">
          <div className="text-base leading-relaxed">
            <EventDescriptionParser description={description} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
