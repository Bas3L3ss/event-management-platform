import React, { Suspense } from "react";
import MainPage from "./_component/ServerSideSuspsense";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import Container from "@/components/Container";

const OneEventPage = ({ params: { id } }: { params: { id: string } }) => {
  return (
    <Container className="py-10 space-y-12">
      <Suspense
        fallback={<SkeletonLoading variant={LoadingVariant.EVENTPAGE} />}
      >
        <MainPage params={{ id }} />
      </Suspense>
    </Container>
  );
};

export default OneEventPage;
