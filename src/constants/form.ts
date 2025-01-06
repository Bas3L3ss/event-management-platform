export const steps = [
  { title: "Event Type", description: "Choose your event type" },
  { title: "Details", description: "Fill in event details" },
  { title: "Date & Time", description: "Set event schedule" },
  { title: "Media", description: "Upload images & videos" },
  { title: "Confirm", description: "Review and submit" },
];
export const formSteps = {
  EVENT_TYPE: 0,
  GENERAL_DETAILS: 1,
  DATE_SELECTION: 2,
  MEDIA_UPLOAD: 3,
  COMPLETION: 4,
} as const;
