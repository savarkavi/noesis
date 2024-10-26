import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid Email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed",
  ),
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
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
