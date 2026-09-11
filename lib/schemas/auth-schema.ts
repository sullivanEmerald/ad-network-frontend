import { z } from "zod";

export const loginSchema = z.object({
    businessEmail: z.string().trim().email("Enter a valid business email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "First name is required")
            .regex(/^[A-Za-z0-9\s]+$/, "First name cannot contain special characters"),
        lastName: z
            .string()
            .trim()
            .min(1, "Last name is required")
            .regex(/^[A-Za-z0-9\s]+$/, "Last name cannot contain special characters"),
        businessEmail: z.string().trim().email("Please enter a valid email address"),
        organizationName: z
            .string()
            .trim()
            .min(1, "Organization name is required"),
        accountType: z.enum(["advertiser", "publisher"], {
            errorMap: () => ({ message: "Select an account type" }),
        }),
        password: z
            .string()
            .min(8, "Your password is not strong enough. Use at least 8 characters")
            .regex(/[0-9]/, "Use at least 1 digit")
            .regex(/[A-Z]/, "Use at least 1 Uppercase letter")
            .regex(/[a-z]/, "Use at least 1 Lowercase letter"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterInput = z.infer<typeof registerSchema>;