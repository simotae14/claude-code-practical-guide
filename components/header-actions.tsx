import type { Session } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

interface HeaderActionsProps {
  session: Session | null;
}

export function HeaderActions({ session }: HeaderActionsProps) {
  if (!session) return null;

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:border-foreground/40 hover:text-foreground"
      >
        Sign out
      </button>
    </form>
  );
}
