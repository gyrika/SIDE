import { Suspense } from "react";
import { redirect } from "next/navigation";

import { AppNav } from "@/components/app-nav";
import { ProfileOnboarding } from "@/components/profile-onboarding";
import { ProfileForm } from "@/components/profile-form";
import type { PrivateProfileContext, Profile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

async function ProfileContent() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, handle, bio")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return <p className="mt-8 text-sm text-muted-foreground">Unable to load your profile.</p>;
  }

  const profile = data as Profile | null;

  if (profile) {
    return (
      <>
        <p className="text-sm font-medium">My Profile</p>
        <h1 className="mt-3 text-3xl font-semibold">Your SIDE identity</h1>
        <p className="mt-3 text-muted-foreground">
          Choose the details other SIDE users can see.
        </p>
        <ProfileForm userId={userId} profile={profile} />
      </>
    );
  }

  const { data: contextData, error: contextError } = await supabase
    .from("private_profile_context")
    .select("study_or_work, strengths_or_learning, interests, connection_goals")
    .eq("id", userId)
    .maybeSingle();

  if (contextError) {
    return <p className="text-sm text-muted-foreground">Unable to begin profile onboarding.</p>;
  }

  return <ProfileOnboarding initialContext={contextData as PrivateProfileContext | null} />;
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto w-full max-w-xl px-6 py-14">
        <Suspense fallback={null}>
          <ProfileContent />
        </Suspense>
      </main>
    </div>
  );
}
