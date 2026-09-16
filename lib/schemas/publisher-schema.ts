import { z } from "zod";

export const publisherSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Publisher name must be at least 2 characters")
        .max(80, "Publisher name must be under 80 characters"),
    contactName: z
        .string()
        .trim()
        .min(2, "Contact name must be at least 2 characters")
        .max(80, "Contact name must be under 80 characters"),
    emailAddress: z.string().trim().email("Enter a valid email address"),
    website: z.string().trim().url("Enter a valid website URL"),
    comments: z.string().trim().max(500, "Comments must be under 500 characters"),
});

export type PublisherFormData = z.infer<typeof publisherSchema>;
