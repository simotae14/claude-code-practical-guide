"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Mode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode: Mode;
}

const INPUT_CLASS =
  "rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 disabled:opacity-50";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  minLength?: number;
  onChange: (value: string) => void;
}

function FormField({ id, label, type, value, placeholder, disabled, minLength, onChange }: FormFieldProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        required
        disabled={disabled}
        minLength={minLength}
        className={INPUT_CLASS}
        placeholder={placeholder}
      />
    </div>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const isSignUp = mode === "sign-up";
  const title = isSignUp ? "Create an account" : "Welcome back";
  const submitLabel = isSignUp ? "Sign up" : "Sign in";
  const toggleHref = isSignUp ? "/authenticate?mode=sign-in" : "/authenticate?mode=sign-up";
  const toggleLabel = isSignUp
    ? "Already have an account? Sign in"
    : "Don't have an account? Sign up";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      if (isSignUp) {
        const { error } = await authClient.signUp.email({
          name: email,
          email,
          password,
        });
        if (error) setError(error.message ?? "Sign up failed.");
        else router.push("/notes");
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) setError(error.message ?? "Sign in failed.");
        else router.push("/notes");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-8 shadow-xl">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">{title}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          placeholder="you@example.com"
          disabled={isPending}
          onChange={setEmail}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          placeholder="••••••••"
          disabled={isPending}
          minLength={8}
          onChange={setPassword}
        />

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
          ) : (
            submitLabel
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        <Link
          href={toggleHref}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {toggleLabel}
        </Link>
      </p>
    </div>
  );
}
