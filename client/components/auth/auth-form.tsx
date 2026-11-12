"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { api, getApiErrorMessage } from "@/lib/api";
import { GOOGLE_CLIENT_ID } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "./google-sign-in-button";

export interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: { id: string; firstName: string; email: string };
  };
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Return the guest to checkout (or any other protected page) after auth. */
  function redirectDestination() {
    const redirect = new URLSearchParams(window.location.search).get(
      "redirect",
    );

    return redirect && redirect.startsWith("/") && !redirect.startsWith("//")
      ? redirect
      : "/";
  }

  function storeSession(token: string) {
    window.localStorage.setItem("josstay_token", token);
    router.push(redirectDestination());
    router.refresh();
  }

  async function handleGoogleCredential(idToken: string) {
    setError(null);

    try {
      setIsSubmitting(true);
      const { data } = await api.post<AuthResponse>("/auth/google", {
        idToken,
      });

      storeSession(data.data.token);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const payload = isSignUp
      ? {
          firstName: String(form.get("firstName") ?? "").trim(),
          lastName: String(form.get("lastName") ?? "").trim(),
          email,
          phone: String(form.get("phone") ?? "").trim() || undefined,
          password,
        }
      : { email, password };

    try {
      setIsSubmitting(true);
      const { data } = await api.post<AuthResponse>(
        isSignUp ? "/auth/register" : "/auth/login",
        payload,
      );

      storeSession(data.data.token);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-md border border-error/25 bg-error/5 px-3.5 py-3 text-secondary text-error"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      {GOOGLE_CLIENT_ID ? (
        <>
          <GoogleSignInButton
            clientId={GOOGLE_CLIENT_ID}
            onCredential={handleGoogleCredential}
          />

          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-sand" />
            <span className="text-metadata text-charcoal/75">
              or use email and password
            </span>
            <span className="h-px flex-1 bg-sand" />
          </div>
        </>
      ) : null}

      {isSignUp ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label="First name" required>
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
            />
          </FormField>
          <FormField id="lastName" label="Last name" required>
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              required
            />
          </FormField>
        </div>
      ) : null}

      <FormField id="email" label="Email address" required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </FormField>

      {isSignUp ? (
        <FormField
          id="phone"
          label="Phone number"
          hint="Used for booking updates on WhatsApp."
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234 800 000 0000"
          />
        </FormField>
      ) : null}

      <FormField
        id="password"
        label="Password"
        required
        hint={isSignUp ? "At least 8 characters." : undefined}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          required
        />
      </FormField>

      <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
        {isSignUp ? "Create account" : "Sign in"}
      </Button>

      <p className="text-center text-secondary text-charcoal/75">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-ocean underline underline-offset-4"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to JosStay?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-ocean underline underline-offset-4"
            >
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
