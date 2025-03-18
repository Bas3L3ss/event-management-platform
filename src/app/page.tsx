import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
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
