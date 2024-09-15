import Container from "@/components/Container";
import Hero from "@/components/Hero";
import SkeletonLoading from "@/components/SkeletonLoading";
import React from "react";

function loading() {
  return (
    <Container>
      <Hero />
      <SkeletonLoading />
    </Container>
  );
}

export default loading;
