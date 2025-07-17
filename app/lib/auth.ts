"use server";
import { cookies } from "next/headers";

export async function setSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
}
