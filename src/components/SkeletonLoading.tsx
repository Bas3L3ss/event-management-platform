import React from "react";
import Container from "./Container";
import { Skeleton } from "./ui/skeleton";

function SkeletonLoading() {
  return (
    <Container className="mt-10">
      <Skeleton className="h-56 w-full" />
    </Container>
  );
}

export default SkeletonLoading;
