"use client";
import { ChevronDown } from "lucide-react";

function ButtonToFeaturedSectionHero() {
  const scrollToFeatured = () => {
    const featuredSection = document.getElementById("featured-events");
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div>
      <button
        onClick={scrollToFeatured}
        className="text-primary hover:text-primary-foreground transition-colors duration-300 flex flex-col items-center"
      >
        <span className="text-sm font-medium mb-2">Featured Events</span>
        <ChevronDown className="animate-bounce" />
      </button>
    </div>
  );
}

export default ButtonToFeaturedSectionHero;
