import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { createAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users, merchantAccounts, merchantAccountMembers } from "@/lib/db/schema";

// Replication pattern for server actions in this codebase:
// 1) Validate FormData with Zod.

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// Registration handler (updated for merchant accounts)
export async function signUpWithPassword(prevState: any, formData: FormData) {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
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

  // Add user as Owner in merchant account
  await db.insert(merchantAccountMembers).values({
    id: crypto.randomUUID(),
    merchantAccountId,
    userId,
    role: "owner",
    joinedAt: new Date(),
  });

  // Set session/cookie for new user
  await createAuthSession({ userId, email });

  return { success: true, message: "Account created", redirect: "/dashboard" };
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signInWithPassword(prevState: any, formData: FormData) {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
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

// Add password reset and other flows as needed