import FeaturedEventsPage from "@/components/FeaturedEvents";
import Hero from "@/components/Hero";
import RecommendationCarousel from "@/components/RecomendationCarousel";

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
