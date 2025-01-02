import Container from "@/components/Container";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import Title from "@/components/Title";
import BreadCrumbsOfEvent from "@/components/BreadCrumbsOfEvent";
export default function loading() {
  return (
    <Container className=" mt-10 ">
      <BreadCrumbsOfEvent eventName={"loading..."} pulse />

      <SkeletonLoading variant={LoadingVariant.EVENTPAGE} />
    </Container>
  );
}
