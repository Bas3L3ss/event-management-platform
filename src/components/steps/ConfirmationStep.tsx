import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ConfirmationStepProps {
  formData: any;
}

export function ConfirmationStep({ formData }: ConfirmationStepProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (formData.image?.length) {
      const urls = Array.from(formData.image).map((file) =>
        URL.createObjectURL(file as Blob)
      );
      setImagePreviews(urls);
    }

    // Create video preview
    if (formData.video?.[0]) {
      const videoUrl = URL.createObjectURL(formData.video[0]);
      setVideoPreview(videoUrl);
    }

    // Cleanup function
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [formData.image, formData.video]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Your Event Details</h3>

          <div className="grid gap-4">
            <div>
              <h4 className="font-medium">Event Type</h4>
              <p className="text-muted-foreground">
                {formData.eventType
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c: string) => c.toUpperCase())}
              </p>
            </div>

            <div>
              <h4 className="font-medium">Event Name</h4>
              <p className="text-muted-foreground">{formData.eventName}</p>
            </div>

            <div>
              <h4 className="font-medium">Host</h4>
              <p className="text-muted-foreground">{formData.host}</p>
            </div>

            <div>
              <h4 className="font-medium">Location</h4>
              <p className="text-muted-foreground">{formData.eventLocation}</p>
            </div>

            <div>
              <h4 className="font-medium">Description</h4>
              <p className="text-muted-foreground">{formData.description}</p>
            </div>

            <div>
              <h4 className="font-medium">Price</h4>
              <p className="text-muted-foreground">{formData.price}</p>
            </div>
            <div>
              <h4 className="font-medium">Reservation Link</h4>
              <p className="text-muted-foreground">
                {formData.reservationTicketLink}
              </p>
            </div>

            <div>
              <h4 className="font-medium">Date Range</h4>
              <p className="text-muted-foreground">
                {formData.dateStart &&
                  new Date(formData.dateStart).toLocaleDateString()}{" "}
                -
                {formData.dateEnd &&
                  new Date(formData.dateEnd).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h4 className="font-medium">Images</h4>
              {imagePreviews.length > 0 ? (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No images selected</p>
              )}
            </div>

            <div>
              <h4 className="font-medium">Video</h4>
              {videoPreview ? (
                <video className="mt-2 max-w-xs" controls>
                  <source src={videoPreview} type={formData.video[0]?.type} />
                </video>
              ) : (
                <p className="text-muted-foreground">No video selected</p>
              )}
            </div>
            <div>
              <h4 className="font-medium">Display video first?</h4>
              <p className="text-muted-foreground">
                {formData.isVideoFirstDisplay ? "Chosen" : "Not chosen"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
