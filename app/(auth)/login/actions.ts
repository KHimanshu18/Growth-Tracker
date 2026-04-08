"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateUser, AUTH_COOKIE_NAME, signAuthToken } from "@/lib/auth";

export type LoginState = {
  error: string | null;
};

const initialState: LoginState = {
  error: null,
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const token = await signAuthToken(user);

  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/overview");
}
