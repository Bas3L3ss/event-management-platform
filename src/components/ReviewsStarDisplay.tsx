import { Star } from "lucide-react";
import React from "react";

function ReviewsStarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex items-center  ">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}

export default ReviewsStarDisplay;
