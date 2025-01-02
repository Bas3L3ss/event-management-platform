import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";

export default function loading() {
  return (
    <div className="mt-20 w-[80%] mx-auto ">
      <SkeletonLoading variant={LoadingVariant.SEARCH} />
      <SkeletonLoading variant={LoadingVariant.CARD} />
    </div>
  );
}
