import { AppNav } from "@/components/app-nav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function DashboardContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims?.email;

  if (error || typeof email !== "string") {
    redirect("/auth/login");
  }

  return (
    <>
      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-muted-foreground">Signed in as:</p>
        <p className="mt-1 break-words text-base font-medium">{email}</p>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto w-full max-w-xl px-6 py-14">
        <p className="text-sm font-medium">SIDE</p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome to SIDE</h1>
        <Suspense fallback={null}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}
