import { AuthForm } from "@/components/auth-form";

type Props = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function AuthenticatePage({ searchParams }: Props) {
  const { mode } = await searchParams;
  const resolvedMode = mode === "sign-up" ? "sign-up" : "sign-in";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <AuthForm key={resolvedMode} mode={resolvedMode} />
    </main>
  );
}
