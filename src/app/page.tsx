import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import React from "react";

function Home() {
  return (
    <main>
      <Hero />
      <FeaturedEventsPage />
      <RecommendationCarousel />
    </main>
  );
}

export default Home;
