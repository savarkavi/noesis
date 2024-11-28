import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid Email address"),
  username: requiredString
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and _(underscore) are allowed",
    )
    .max(20, "Username can only have a maximum of 20 characters."),
  password: requiredString.min(
    8,
    "Password must be at least 8 characters long",
  ),
});

export const loginSchema = z.object({
  usernameOrEmail: requiredString,
  password: requiredString,
});

export const postSchema = z.object({
  caption: requiredString,
  attachments: z
    .array(z.string())
    .max(4, "You cannot upload more than 4 files."),
});

export const updateUserProfileSchema = z.object({
  fullname: z
    .string()
    .max(20, "Fullname can only have a maximum of 20 characters.")
    .regex(
      /^[a-zA-Z'’-]+( [a-zA-Z'’-]+)*$/,
      "Only letters, hyphens and apostrophes are allowed",
    )
    .optional(),
  username: requiredString
    .max(20, "Username can only have a maximum of 20 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers and _(underscore) are allowed",
    ),
  bio: z
    .string()
    .max(300, "Bio can only have a maximum of 300 characters.")
    .optional(),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type UserProfileValues = z.infer<typeof updateUserProfileSchema>;
