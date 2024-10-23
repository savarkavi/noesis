"use server";

import prisma from "@/lib/prisma";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  getCurrentSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/lib/session";
import {
  loginSchema,
  LoginValues,
  signUpSchema,
  SignUpValues,
} from "@/lib/validation";
import { hash, verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export const signUp = async (credentials: SignUpValues) => {
  try {
    const { email, username, password } = signUpSchema.parse(credentials);

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const exisitingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (exisitingUser)
      return { error: "Username is already taken. Try a different one." };

    const exisitingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (exisitingEmail)
      return { error: "Email already exists. Try signing in instead." };

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    const token = generateSessionToken();
    const session = await createSession(token, newUser.id);

    await setSessionTokenCookie(token, session.expiresAt);

    return redirect("/home");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong. Try again later." };
  }
};

export const login = async (credentials: LoginValues) => {
  try {
    const { usernameOrEmail, password } = loginSchema.parse(credentials);

    const exisitingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!exisitingUser || !exisitingUser.passwordHash)
      return { error: "Incorrect username or password" };

    const validPassword = await verify(exisitingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) return { error: "Incorrect username or password" };

    const token = generateSessionToken();
    const session = await createSession(token, exisitingUser.id);

    await setSessionTokenCookie(token, session.expiresAt);

    return redirect("/home");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong. Try again later." };
  }
};

export const logout = async () => {
  const { user, session } = await getCurrentSession();

  if (!user) throw new Error("Unauthorized");

  await invalidateSession(session.id);
  await deleteSessionTokenCookie();

  return redirect("/");
};
