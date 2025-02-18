import { Suspense } from "react";
import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";

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
