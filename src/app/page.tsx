import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const RecommendationCarousel = dynamic(
  () => import("@/components/RecomendationCarousel")
);

function Home() {
  return (
    <>
      <Hero />
      <FeaturedEventsPage />

      <RecommendationCarousel className="mt-10" />
    </>
  );
}

export default Home;
