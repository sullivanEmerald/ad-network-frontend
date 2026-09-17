import { z } from "zod";

export const zoneSchema = z.object({
    name: z.string().trim().min(2, "Zone name must be at least 2 characters").max(80, "Zone name must be under 80 characters"),
    width: z.number().int("Width must be a whole number").min(1, "Width must be greater than 0").max(5000, "Width must be under 5000 pixels"),
    height: z.number().int("Height must be a whole number").min(1, "Height must be greater than 0").max(5000, "Height must be under 5000 pixels"),
    type: z.union([
        z.enum(["0", "1", "2", "3", "4", "5"]),
        z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    ]),
    description: z.string().trim().max(250, "Description must be under 250 characters"),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;