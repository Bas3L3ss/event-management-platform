import Container from "@/components/Container";
import Hero from "@/components/Hero";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import React from "react";

function loading() {
  return (
    <Container>
      <Hero />
      <SkeletonLoading variant={LoadingVariant.FEATURED} />
    </Container>
  );
}

export default loading;
