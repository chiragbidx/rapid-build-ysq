// Actions: server-only, never imported in client
"use server";

import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { createAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users, merchantAccounts, merchantAccountMembers } from "@/lib/db/schema";

// Replication pattern for server actions in this codebase:
// 1) Validate FormData or object with Zod.

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// These functions are truly server-only and safe to import as named exports only in client forms
export async function signUpWithPassword(_prevState: any, formData: any) {
  let parsed;
  if (formData instanceof FormData) {
    parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  } else {
    parsed = signUpSchema.safeParse(formData);
  }
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }

  const { email, password, firstName, lastName } = parsed.data;

  // Check for existing user
  const existingUser = await db.query.users.findFirst({ where: (u) => u.email === email });
  if (existingUser) {
    return { success: false, message: "Account already exists for this email." };
  }

  const hashedPassword = await hash(password, 10);

  // Create user
  const userId = crypto.randomUUID();
  await db.insert(users).values({
    id: userId,
    email,
    firstName,
    lastName,
    passwordHash: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Auto-create Merchant Account
  const merchantAccountId = crypto.randomUUID();
  await db.insert(merchantAccounts).values({
    id: merchantAccountId,
    name: `${firstName} ${lastName}'s Account`,
    businessEmail: email,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(merchantAccountMembers).values({
    id: crypto.randomUUID(),
    merchantAccountId,
    userId,
    role: "owner",
    joinedAt: new Date(),
  });

  await createAuthSession({ userId, email });

  return { success: true, message: "Account created", redirect: "/dashboard" };
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signInWithPassword(_prevState: any, formData: any) {
  let parsed;
  if (formData instanceof FormData) {
    parsed = signInSchema.safeParse(Object.fromEntries(formData));
  } else {
    parsed = signInSchema.safeParse(formData);
  }
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0].message };
  }
  const { email, password } = parsed.data;

  // Find user
  const user = await db.query.users.findFirst({ where: (u) => u.email === email });
  if (!user) {
    return { success: false, message: "No account found for this email." };
  }

  const isMatch = await compare(password, user.passwordHash);

  if (!isMatch) {
    return { success: false, message: "Incorrect password." };
  }

  await createAuthSession({ userId: user.id, email: user.email });

  return { success: true, message: "Signed in", redirect: "/dashboard" };
}