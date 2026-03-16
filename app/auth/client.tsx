"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { signUpWithPassword, signInWithPassword } from "./actions"; // do NOT import the full actions file, just the server action functions

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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

// Rather than importing the full ./actions file, we only import the server actions

function AuthForm({ mode }: { mode: "signup" | "signin" }) {
  const [formState, formAction] = useFormState(
    mode === "signup" ? signUpWithPassword : signInWithPassword,
    {}
  );

  // use `react-hook-form` for client-side input management, and submit to server action
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
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
          <FormField
            render={({}) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            render={({}) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </>
      )}
      <FormField
        render={({}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        render={({}) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </FormControl>
          </FormItem>
        )}
      />
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