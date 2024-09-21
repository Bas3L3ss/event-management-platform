import { EventType } from "@prisma/client";
import { z, ZodSchema } from "zod";

const eventTypeSchema = z.nativeEnum(EventType);

//helper
const oneDayAhead = new Date();
oneDayAhead.setDate(oneDayAhead.getDate() + 1);

export const eventSchema = z
  .object({
    eventName: z
      .string()
      .min(2, {
        message: "event name must be at least 2 characters.",
      })
      .max(100, {
        message: "event name must be less than 100 characters.",
      }),
    host: z.string(),
    eventType: eventTypeSchema,
    reservationTicketLink: z.string(),
    eventLocation: z.string(),
    price: z.coerce.number().int().min(0, {
      message: "price must be a positive number.",
    }),

    description: z.string().refine(
      (description) => {
        const wordCount = description.split(" ").length;
        return wordCount >= 10 && wordCount <= 1000;
      },
      {
        message: "description must be between 10 and 1000 words.",
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
      z.date().refine((date) => date >= oneDayAhead, {
        message: "Start date must be at least 1 day ahead from now.",
      })
    ),
    dateEnd: z.preprocess((val) => {
      if (typeof val === "string") {
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date; // Return undefined if the date is invalid
      }
      return val;
    }, z.date()),
    isVideoFirstDisplay: z.coerce.boolean(),
  })

  .superRefine((data, ctx) => {
    if (data.dateEnd < data.dateStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than the start date.",
        path: ["dateEnd"], // Point to the dateEnd field
      });
    }
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
  const maxUploadSize = 5 * 1024 * 1024; // 5 MB
  const acceptedFileTypes = ["image/"];

  return z
    .array(z.instanceof(File))
    .refine((files) => files.length > 0, "At least one image file is required")
    .refine(
      (files) => files.every((file) => file.size <= maxUploadSize),
      `Each file size must be less than 5 MB`
    )
    .refine(
      (files) =>
        files.every((file) =>
          acceptedFileTypes.some((type) => file.type.startsWith(type))
        ),
      "All files must be images"
    );
}

function validateVideoFile() {
  const maxUploadSize = 50 * 1024 * 1024; // 50 MB
  const acceptedFileTypes = ["video/"];

  return z
    .instanceof(File)
    .refine(
      (file) => !file || file.size <= maxUploadSize,
      `File size must be less than 50 MB`
    )
    .refine(
      (file) =>
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type)),
      "File must be a video"
    );
}

export const filesEditSchema = z.object({
  image: validateImageEditFiles(),
  video: validateVideoEditFile(),
});
function validateImageEditFiles() {
  const maxUploadSize = 5 * 1024 * 1024; // 5 MB
  const acceptedFileTypes = ["image/"];

  return z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= maxUploadSize),
      `Each file size must be less than 5 MB`
    )
    .refine(
      (files) =>
        files.every((file) =>
          acceptedFileTypes.some((type) => file.type.startsWith(type))
        ),
      "All files must be images"
    )
    .optional();
}

function validateVideoEditFile() {
  const maxUploadSize = 50 * 1024 * 1024; // 50 MB
  const acceptedFileTypes = ["video/"];

  return z
    .instanceof(File)
    .refine(
      (file) => !file || file.size <= maxUploadSize,
      `File size must be less than 50 MB`
    )
    .refine(
      (file) =>
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type)),
      "File must be a video"
    )
    .optional();
}

export const filesSchema = z.object({
  image: validateImageFiles(),
  video: validateVideoFile(),
});
