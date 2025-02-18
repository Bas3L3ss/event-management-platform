// export default ReviewsStarDisplay;
import { Star, StarHalf } from "lucide-react";
import React from "react";

function ReviewsStarDisplay({ rating }: { rating: number | null }) {
  if (rating == null) {
    return (
      <span className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star key={index} className="w-4 h-4 text-gray-300" />
        ))}
      </span>
    );
  }
  return (
    <span className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const difference = starValue - rating;

        return difference > 0.75 ? (
          // Empty star
          <Star key={index} className="w-4 h-4 text-gray-300" />
        ) : difference > 0.25 ? (
          // Half star
          <StarHalf
            key={index}
            className="w-4 h-4 text-yellow-400 fill-[#facc15]"
          />
        ) : (
          // Full star
          <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
        );
      })}
      <span className="ml-2 text-sm font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}

export default ReviewsStarDisplay;
