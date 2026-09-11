import { z } from "zod";

export const advertiserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Advertiser name must be at least 2 characters")
        .max(80, "Advertiser name must be under 80 characters"),
    email: z.string().trim().email("Enter a valid email address"),
});

export type AdvertiserFormData = z.infer<typeof advertiserSchema>;