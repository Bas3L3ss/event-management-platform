import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Event } from "@prisma/client";
import Link from "next/link";
import { Calendar, LinkIcon } from "lucide-react";
import DatePrinter from "./DatePrinter";
import MediaRenderer from "./MediaFileRender";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import { EventDescriptionDialog } from "./EventDescriptionDialog";

export function CarouselFeatured({
  featuredEvents,
}: {
  featuredEvents: Event[];
}) {
  const maxLength = 100;
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {featuredEvents.map((el, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
            <article className="block h-full">
              <Card className="h-full  ">
                <CardContent className="flex flex-col h-full justify-between p-6">
                  <div>
                    <p className="text-sm text-primary flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <DatePrinter
                        dateEnd={el.dateEnd}
                        dateStart={el.dateStart}
                      />
                    </p>
                    <Link
                      className="mb-2  inline-flex items-center gap-2"
                      href={`/events/${el.id}`}
                    >
                      <h3 className="text-xl font-semibold line-clamp-2">
                        {el.eventName}
                      </h3>
                      <LinkIcon size={16} className="text-blue-600" />
                    </Link>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Host: {el.hostName} - Genre:{" "}
                      {el.type
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c: string) => c.toUpperCase())}
                    </p>
                  </div>
                  <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                    <MediaRenderer
                      url={el.eventImgOrVideoFirstDisplay as string}
                      alt={el.eventName}
                    />
                  </div>
                  <div>
                    <p className="flex items-center mb-2">
                      <ReviewsStarDisplay rating={el.rating} />
                      <span className="text-sm text-muted-foreground ml-2">
                        / 5.0
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      <EventDescriptionDialog
                        description={el.eventDescription}
                      />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex -left-12" />
      <CarouselNext className="hidden lg:flex -right-12" />
    </Carousel>
  );
}
