'use server';
import { signIn, auth } from "@/auth";
import prisma from "../../lib/db";

export async function loginWithEmail(email: string) {
  await signIn("nodemailer", { email, redirectTo: "/client" });
}

export async function getClientSession() {
  const session = await auth();
  return session;
}

export async function getClientById(userId: string) {
  const client = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      leads: {
        include: { calls: true },
      },
    },
  });
  return client ? JSON.parse(JSON.stringify(client)) : null;
}

export async function getClientByEmail(email: string) {
  const client = await prisma.user.findUnique({
    where: { email },
    include: {
      leads: {
        include: { calls: true },
      },
    },
  });
  return client ? JSON.parse(JSON.stringify(client)) : null;
}
