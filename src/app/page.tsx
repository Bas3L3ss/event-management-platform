import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import React from "react";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedEventsPage />
      <RecommendationCarousel />
    </>
  );
}

export default Home;
