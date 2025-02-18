import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import EventDescriptionParser from "../EventDescriptionParser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <Card className="bg-background/40 dark:bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Review Your Event Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Event Type
              </h4>
              <p className="text-lg">
                {formData.eventType
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c: string) => c.toUpperCase())}
              </p>
            </article>

            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Event Name
              </h4>
              <p className="text-lg">{formData.eventName}</p>
            </article>

            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Host
              </h4>
              <p className="text-lg">{formData.host}</p>
            </article>

            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </h4>
              <p className="text-lg">{formData.eventLocation}</p>
            </article>
          </div>

          <Separator />

          <article className="space-y-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h4>
            <Card className="overflow-hidden">
              <ScrollArea className="h-[200px]">
                <CardContent className="p-4">
                  <EventDescriptionParser
                    className="prose prose-sm dark:prose-invert max-w-none"
                    description={formData.description}
                  />
                </CardContent>
              </ScrollArea>
            </Card>
          </article>

          <div className="grid gap-6 sm:grid-cols-2">
            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Price
              </h4>
              <p className="text-lg">{formData.price}</p>
            </article>

            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Reservation Link
              </h4>
              <p className="text-lg break-all">
                {formData.reservationTicketLink}
              </p>
            </article>

            <article className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Date Range
              </h4>
              <p className="text-lg">
                {formData.dateStart &&
                  new Date(formData.dateStart).toLocaleDateString()}{" "}
                -
                {formData.dateEnd &&
                  new Date(formData.dateEnd).toLocaleDateString()}
              </p>
            </article>
          </div>

          <Separator />

          <article className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Media
            </h4>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <h5 className="font-medium">Images</h5>
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No images selected
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Video</h5>
                {videoPreview ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <video
                      className="w-full rounded-lg shadow-sm aspect-video object-cover"
                      controls
                    >
                      <source
                        src={videoPreview}
                        type={formData.video[0]?.type}
                      />
                    </video>
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground italic">
                    No video selected
                  </p>
                )}

                <div className="mt-4">
                  <h5 className="font-medium">Display Preference</h5>
                  <p className="text-muted-foreground">
                    Video will be displayed{" "}
                    {formData.isVideoFirstDisplay ? "first" : "after images"}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </CardContent>
      </Card>
    </motion.section>
  );
}
