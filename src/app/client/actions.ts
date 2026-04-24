'use server';
import { signIn } from "@/auth";

export async function loginWithEmail(email: string) {
  await signIn("nodemailer", { email, redirectTo: "/client" });
}
