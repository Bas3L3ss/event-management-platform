"use client";
import Container from "@/components/Container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createEventAction } from "@/utils/actions/eventsActions";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventSchema,
  filesSchema,
  validateWithZodSchema,
} from "@/utils/schema";
import {
  EventTypeStep,
  GeneralDetailsStep,
  DateSelectionStep,
  ConfirmationStep,
  MediaUploadStep,
  CompletionStep,
} from "@/components/steps";
import { cn, getFieldsForStep } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Order } from "@prisma/client";

const formSteps = {
  EVENT_TYPE: 0,
  GENERAL_DETAILS: 1,
  DATE_SELECTION: 2,
  MEDIA_UPLOAD: 3,
  COMPLETION: 4,
} as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

// Progress steps for the stepper
const steps = [
  { title: "Event Type", description: "Choose your event type" },
  { title: "Details", description: "Fill in event details" },
  { title: "Date & Time", description: "Set event schedule" },
  { title: "Media", description: "Upload images & videos" },
  { title: "Confirm", description: "Review and submit" },
];

function AddEventsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [validatedFiles, setValidatedFiles] = useState<
    | {
        image: File[];
        video: File;
      }
    | undefined
  >(undefined);

  const methods = useForm({
    resolver: zodResolver(eventSchema),
    mode: "onChange",
    defaultValues: {
      eventType: "",
      eventName: "",
      host: "",
      eventLocation: "",
      description: "",
      price: "",
      reservationTicketLink: "",
      dateStart: undefined,
      dateEnd: undefined,
      isVideoFirstDisplay: false,
      latitude: 0,
      longitude: 0,
      image: undefined,
      video: undefined,
    },
  });

  const { handleSubmit, trigger, watch } = methods;

  const goToNextStep = async () => {
    const fieldsToValidate: Array<
      | "eventName"
      | "eventType"
      | "host"
      | "eventLocation"
      | "description"
      | "price"
      | "reservationTicketLink"
      | "dateStart"
      | "dateEnd"
      | "isVideoFirstDisplay"
      | "image"
      | "video"
    > = getFieldsForStep(currentStep); // Ensure correct type

    // Special handling for media upload step
    if (currentStep === formSteps.MEDIA_UPLOAD) {
      try {
        const formData = new FormData();
        const images = watch("image");
        const video = watch("video")?.[0];

        if (images) {
          const imageFiles = Array.from(images as FileList);
          imageFiles.forEach((file) => {
            formData.append("image", file);
          });
        }
        if (video && typeof video === "object") {
          formData.append("video", video as File);
        }

        // Validate files using filesSchema
        const validatedFiles = validateWithZodSchema(filesSchema, {
          image: images ? Array.from(images) : [],
          video: video || undefined,
        });
        if (validatedFiles.video && validatedFiles.image.length > 0) {
          setDirection(1);
          setCurrentStep((prev) => Math.min(prev + 1, formSteps.COMPLETION));
          setValidatedFiles(validatedFiles);
          return;
        }
        throw new Error("Please select valid files");
      } catch (error) {
        toast({
          title: "Warning",
          description:
            error instanceof Error
              ? error.message
              : "Please select valid files",
          variant: "destructive",
        });
        return;
      }
    }

    // Normal validation for other steps
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, formSteps.COMPLETION));
    } else {
    }
  };

  const goToPrevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: any) => {
    if (currentStep !== formSteps.COMPLETION) {
      return;
    }
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Add all text/date fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "image" &&
          key !== "video" &&
          value !== null &&
          value !== undefined
        ) {
          formData.append(key, value as string);
        }
      });

      // Add files
      if (validatedFiles && validatedFiles.image.length > 0) {
        Array.from(validatedFiles.image).forEach((file) => {
          formData.append("image", file as File);
        });
      }
      if (validatedFiles && validatedFiles.video) {
        formData.append("video", validatedFiles.video);
      }
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const { order } = await createEventAction(null, formData);
      setOrder(order);
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentStep === formSteps.COMPLETION && !isDisabled) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, 100);
    } else {
      setIsDisabled(false);
    }
  }, [currentStep]);
  return (
    <Container className="mt-10 flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events/myevents">My Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add Event</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Add Event</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-primary">
          {isSubmitted ? "Complete" : steps[currentStep].title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isSubmitted
            ? "Event advertisement is ready"
            : steps[currentStep].description}
        </p>

        <div className="w-full bg-secondary h-2 rounded-full">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300 ease-in-out",
              isSubmitted
                ? "bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                : "bg-primary"
            )}
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <div
          className={cn(
            "border border-border p-8 rounded-lg shadow-sm bg-card mt-6",
            isSubmitted && "border-none  "
          )}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {currentStep === formSteps.EVENT_TYPE && <EventTypeStep />}
                  {currentStep === formSteps.GENERAL_DETAILS && (
                    <GeneralDetailsStep />
                  )}
                  {currentStep === formSteps.DATE_SELECTION && (
                    <DateSelectionStep />
                  )}
                  {currentStep === formSteps.MEDIA_UPLOAD && (
                    <MediaUploadStep />
                  )}
                  {currentStep === formSteps.COMPLETION &&
                    (isSubmitted ? (
                      <CompletionStep order={order!} />
                    ) : (
                      <ConfirmationStep formData={watch()} />
                    ))}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between mt-8 pt-4 border-t">
                {currentStep > 0 && !isSubmitted ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPrevStep}
                    type="button"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
                    disabled={isSubmitting}
                  >
                    Previous
                  </motion.button>
                ) : null}

                {currentStep < formSteps.COMPLETION ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNextStep}
                    type="button"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md ml-auto"
                    disabled={isSubmitting}
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={isDisabled}
                    type="submit"
                    className={cn(
                      "px-4 py-2 bg-primary text-primary-foreground rounded-md ml-auto",
                      isSubmitting && "animate-pulse",
                      isSubmitted && "hidden"
                    )}
                  >
                    {!isSubmitting ? "Create Event" : "...Creating"}
                  </motion.button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Container>
  );
}

export default AddEventsPage;
