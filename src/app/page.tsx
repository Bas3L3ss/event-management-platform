import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import { Suspense } from "react";

function Home() {
  return (
    <>
      <Hero />
      <FeaturedEventsPage />
      <Suspense
        fallback={<SkeletonLoading variant={LoadingVariant.FEATURED} />}
      >
        <RecommendationCarousel />
      </Suspense>
    </>
  );
}

export default Home;
