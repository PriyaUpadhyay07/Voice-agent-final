'use server';
import { signIn, auth } from "@/auth";

export async function loginWithEmail(email: string) {
  await signIn("nodemailer", { email, redirectTo: "/client" });
}

export async function getClientSession() {
  const session = await auth();
  return session;
}
