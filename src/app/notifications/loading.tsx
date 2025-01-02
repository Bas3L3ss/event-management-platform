import Container from "@/components/Container";
import SkeletonLoading from "@/components/SkeletonLoading";

export default function loading() {
  return (
    <Container className="mt-10 space-x-2">
      <h1 className="text-3xl font-bold">Your Notifications</h1>
      <SkeletonLoading />
    </Container>
  );
}
