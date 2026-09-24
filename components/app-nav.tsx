import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";

export function AppNav() {
  return (
    <header className="border-b">
      <div className="mx-auto flex min-h-16 max-w-3xl items-center justify-between gap-4 px-5">
        <Link href="/dashboard" className="text-sm font-semibold">
          SIDE
        </Link>
        <nav className="flex items-center gap-4 text-sm" aria-label="Main navigation">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/people" className="text-muted-foreground hover:text-foreground">
            People
          </Link>
          <Link href="/profile" className="text-muted-foreground hover:text-foreground">
            My Profile
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
