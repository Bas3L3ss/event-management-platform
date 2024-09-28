import { EventType } from "@prisma/client";
import { z, ZodSchema } from "zod";

const MAX_VIDEO_SIZE = 12 * 1024 * 1024; // 12 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const eventTypeSchema = z.nativeEnum(EventType, {
  errorMap: () => ({
    message: "please select a valid event type from the available options",
  }),
});

//helper
const oneDayAhead = new Date();
oneDayAhead.setDate(oneDayAhead.getDate() + 1);

export const eventSchema = z
  .object({
    eventName: z
      .string()
      .min(2, {
        message: "event name must be at least 2 characters",
      })
      .max(100, {
        message: "event name must be less than 100 characters",
      })
      .transform((val) => val.trim()),

    host: z
      .string()
      .min(1, "please fill in your event's host name")
      .transform((val) => val.trim()),

    eventType: eventTypeSchema,

    reservationTicketLink: z
      .string()
      .url("Reservation ticket link must be a valid URL."),

    eventLocation: z
      .string()
      .min(1, "please fill in your event's location")
      .transform((val) => val.trim()),

    price: z.coerce.number().int().min(0, {
      message: "price must be a positive number",
    }),

    description: z
      .string()
      .transform((val) => val.trim())
      .refine(
        (description) => {
          const wordCount = description.split(" ").length;
          return wordCount >= 10 && wordCount <= 1000;
        },
        {
          message: "description must be between 10 and 1000 words",
        }
      ),
    dateStart: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          const date = new Date(val);
          return isNaN(date.getTime()) ? undefined : date; // Return undefined if the date is invalid
        }
        return val;
      },
      z
        .date({
          required_error: "please include a date start of your event",
        })
        .refine((date) => date >= oneDayAhead, {
          message: "Start date must be at least 1 day ahead from now",
        })
    ),
    dateEnd: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          const date = new Date(val);
          return isNaN(date.getTime()) ? undefined : date; // Return undefined if the date is invalid
        }
        return val;
      },
      z.date({
        required_error: "please include a date end of your event",
      })
    ),
    isVideoFirstDisplay: z.coerce.boolean(),
  })

  .superRefine((data, ctx) => {
    if (data.dateEnd < data.dateStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than the start date",
        path: ["dateEnd"], // Point to the dateEnd field
      });
    }
  });

export const eventPaidSchema = z.object({
  eventName: z
    .string()
    .min(2, {
      message: "event name must be at least 2 characters",
    })
    .max(100, {
      message: "event name must be less than 100 characters",
    })
    .transform((val) => val.trim()),
  host: z.string().min(1, "please fill in your event's host name"),
  eventType: eventTypeSchema,
  reservationTicketLink: z
    .string()
    .url("Reservation ticket link must be a valid URL."),

  eventLocation: z.string().min(1, "please fill in your event's location"),
  price: z.coerce.number().int().min(0, {
    message: "price must be a positive number",
  }),

  description: z.string().refine(
    (description) => {
      const wordCount = description.split(" ").length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: "description must be between 10 and 1000 words",
    }
  ),

  isVideoFirstDisplay: z.coerce.boolean(),
});
export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(", "));
  }
  return result.data;
}

function validateImageFiles() {
  const maxUploadSize = MAX_IMAGE_SIZE;
  const acceptedFileTypes = ["image/"];

  return z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, "At least one image file is required")
    .refine(
      (files) => files.every((file) => file.size <= maxUploadSize),
      `Each file size must be less than 4 MB`
    )
    .refine(
      (files) =>
        files.every((file) =>
          acceptedFileTypes.some((type) => file.type.startsWith(type))
        ),
      "please provide images or a correct image path "
    );
}

function validateVideoFile() {
  const maxUploadSize = MAX_VIDEO_SIZE; // 12 MB
  const acceptedFileTypes = ["video/"];

  return z
    .instanceof(File)
    .refine(
      (file) => !file || file.size <= maxUploadSize,
      `File size must be less than 12 MB`
    )
    .refine(
      (file) =>
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type)),
      "please provide a video"
    );
}

export const filesEditSchema = z.object({
  image: validateImageEditFiles(),
  video: validateVideoEditFile(),
});

function validateImageEditFiles() {
  const maxUploadSize = MAX_IMAGE_SIZE; // 4 MB
  const acceptedFileTypes = ["image/"];

  return z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= maxUploadSize),
      `Each file size must be less than 4 MB`
    )
    .refine(
      (files) =>
        files.every((file) =>
          acceptedFileTypes.some((type) => file.type.startsWith(type))
        ),
      "please provide images or a correct image path "
    )
    .optional();
}

function validateVideoEditFile() {
  const maxUploadSize = MAX_VIDEO_SIZE; // 12 MB
  const acceptedFileTypes = ["video/"];

  return z
    .instanceof(File)
    .refine(
      (file) => !file || file.size <= maxUploadSize,
      `File size must be less than 12 MB`
    )
    .refine(
      (file) =>
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type)),
      "please provide a video"
    )
    .optional();
}

export const filesSchema = z.object({
  image: validateImageFiles(),
  video: validateVideoFile(),
});
