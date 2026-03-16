"use client";

import * as React from "react";
import { signUpWithPassword, signInWithPassword } from "./actions";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function AuthForm({ mode }: { mode: "signup" | "signin" }) {
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    error: "",
  });
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    let error = "";
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse(form);
        if (!parsed.success) {
          error = parsed.error.errors[0]?.message || "Invalid input";
        } else {
          const result = await signUpWithPassword({}, form as any);
          if (result && result.success && result.redirect) {
            window.location.href = result.redirect;
          } else {
            error = result.message || "Could not create account.";
          }
        }
      } else {
        const parsed = signInSchema.safeParse(form);
        if (!parsed.success) {
          error = parsed.error.errors[0]?.message || "Invalid input";
        } else {
          const result = await signInWithPassword({}, form as any);
          if (result && result.success && result.redirect) {
            window.location.href = result.redirect;
          } else {
            error = result.message || "Could not sign in.";
          }
        }
      }
    } catch (e) {
      error = (e as any).message || "Unknown error";
    }
    setForm((f) => ({ ...f, error }));
    setSubmitting(false);
  }

  return (
    <form className="space-y-4 max-w-md mx-auto" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold mb-4 text-center">
        {mode === "signup" ? "Create your StripeForge account" : "Log in to StripeForge"}
      </h1>
      {mode === "signup" && (
        <>
          <div>
            <label className="block font-medium mb-1" htmlFor="firstName">
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              autoComplete="given-name"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="lastName">
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
              autoComplete="family-name"
            />
          </div>
        </>
      )}
      <div>
        <label className="block font-medium mb-1" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>
      {form.error && (
        <div className="text-red-600 text-sm mb-2 text-center">{form.error}</div>
      )}
      <Button className="w-full" type="submit" disabled={submitting}>
        {submitting
          ? mode === "signup"
            ? "Creating account..."
            : "Signing in..."
          : mode === "signup"
          ? "Sign up"
          : "Sign in"}
      </Button>
    </form>
  );
}

export default function AuthClient() {
  const [mode, setMode] = React.useState<"signup" | "signin">(() => {
    if (typeof window !== "undefined" && window.location.hash === "#signin") return "signin";
    return "signup";
  });

  return (
    <div className="py-20 px-4">
      <AuthForm mode={mode} />

      <div className="mt-4 text-center text-muted-foreground text-sm">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <button
              className="text-primary underline"
              type="button"
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Need to create an account?{" "}
            <button
              className="text-primary underline"
              type="button"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}