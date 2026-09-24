import { z } from "zod";

const optionalEmail = (message: string) => z.union([
    z.string().trim().email(message),
    z.literal(""),
]).optional();

const optionalUrl = (message: string) => z.union([
    z.string().trim().url(message),
    z.literal(""),
]).optional();

export const loginSchema = z.object({
    email: z.string().trim().email("Enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        advertiserName: z.string().trim().optional(),
        advertiserEmail: optionalEmail("Enter a valid advertiser email address"),
        publisherName: z.string().trim().optional(),
        contactName: z.string().trim().optional(),
        emailAddress: optionalEmail("Enter a valid publisher email address"),
        website: optionalUrl("Enter a valid website URL"),
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
    .superRefine((data, context) => {
        if (data.password !== data.confirmPassword) {
            context.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }

        if (data.accountType === "advertiser") {
            if (!data.advertiserName || data.advertiserName.length < 2) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Advertiser name must be at least 2 characters",
                    path: ["advertiserName"],
                });
            }
            if (!data.advertiserEmail) {
                context.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Enter a valid advertiser email address",
                    path: ["advertiserEmail"],
                });
            }
        }

        if (data.accountType === "publisher") {
            const publisherFields = [
                ["publisherName", data.publisherName, "Publisher name must be at least 2 characters"],
                ["contactName", data.contactName, "Contact name must be at least 2 characters"],
                ["emailAddress", data.emailAddress, "Enter a valid publisher email address"],
                ["website", data.website, "Enter a valid website URL"],
            ] as const;

            publisherFields.forEach(([path, value, message]) => {
                if (!value || value.length < 2) {
                    context.addIssue({
                        code: z.ZodIssueCode.custom,
                        message,
                        path: [path],
                    });
                }
            });
        }
    });

export type RegisterInput = z.infer<typeof registerSchema>;