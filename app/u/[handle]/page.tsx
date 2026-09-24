import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AppNav } from "@/components/app-nav";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

async function PublicProfileContent({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, handle, bio")
    .eq("handle", handle)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const profile = data as Profile;

  return (
    <>
      <h1 className="mt-3 text-3xl font-semibold">{profile.display_name}</h1>
      <p className="mt-2 text-muted-foreground">@{profile.handle}</p>
      {profile.bio ? <p className="mt-8 leading-7">{profile.bio}</p> : null}
      <div className="mt-10">
        <Button disabled>
          Send Request <span className="text-xs font-normal">Coming next</span>
        </Button>
      </div>
    </>
  );
}

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto w-full max-w-xl px-6 py-14">
        <p className="text-sm font-medium">SIDE</p>
        <Suspense fallback={null}>
          <PublicProfileContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
