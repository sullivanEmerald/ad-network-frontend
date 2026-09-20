import { z } from "zod";
export const bannerFormSchema = z.object({
    name: z.string().trim().min(2, "Enter a banner name"),
    destinationUrl: z.string().trim().url("Enter a valid destination URL"),
    image: z.custom<File>(
        (value) => typeof File !== "undefined" && value instanceof File,
        "Select an image for the banner",
    ),
});

export type BannerFormData = z.infer<typeof bannerFormSchema>;