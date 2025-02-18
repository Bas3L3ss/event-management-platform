import Container from "@/components/Container";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import React from "react";

const loading = () => {
  return (
    <Container className="mt-10">
      <SkeletonLoading variant={LoadingVariant.FORM} />
    </Container>
  );
};

export default loading;
