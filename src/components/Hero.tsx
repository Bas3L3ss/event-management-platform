import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Search, Share2, ChevronDown } from "lucide-react";
import ButtonToFeaturedSectionHero from "./ButtonToFeaturedSectionHero";

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-24 lg:py-32 isolate bg-gradient-to-br from-background to-primary/10">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 32V.5H32"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
              ></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)"></rect>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="container py-10 lg:py-16">
          <div className="max-w-3xl text-center mx-auto">
            <p className="text-primary font-semibold mb-4 flex items-center justify-center">
              <Calendar className="mr-2" size={20} />
              Discover & Share Exciting Events
            </p>
            {/* Title */}
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Your Gateway to Unforgettable Experiences
            </h1>
            {/* End Title */}
            <p className="text-xl text-muted-foreground mb-8">
              Whether you&apos;re looking to advertise your next big event or
              searching for the perfect outing with friends and family, EventHub
              connects you to a world of possibilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center z-10">
              <Button asChild size="lg" className="group">
                <Link href="/events">
                  <Search className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Explore Events
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group">
                <Link href="/events/myevents">
                  <Share2 className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Advertise Your Event
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 right-0 translate-y-1/2 translate-x-1/2 w-72 h-72 bg-secondary/30 rounded-full blur-3xl opacity-50"></div>

      {/* Scroll down button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ButtonToFeaturedSectionHero />
      </div>
    </div>
  );
}
