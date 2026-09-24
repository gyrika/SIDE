"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/profile";

type ProfileFormProps = {
  userId: string;
  profile: Profile | null;
};

const HANDLE_PATTERN = /^[a-z0-9_-]+$/;

export function ProfileForm({ userId, profile }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [handle, setHandle] = useState(profile?.handle ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const hasProfile = profile !== null;

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedHandle = handle.trim().toLowerCase();

    if (!HANDLE_PATTERN.test(normalizedHandle)) {
      setError("Use lowercase letters, numbers, underscores, or hyphens only.");
      return;
    }

    setError(null);
    setIsSaving(true);

    const values = {
      display_name: displayName.trim(),
      handle: normalizedHandle,
      bio: bio.trim(),
    };
    const supabase = createClient();
    const { error: saveError } = hasProfile
      ? await supabase.from("profiles").update(values).eq("id", userId)
      : await supabase.from("profiles").insert({ id: userId, ...values });

    if (saveError) {
      setError(
        saveError.code === "23505"
          ? "That handle is already in use."
          : "We could not save your profile. Please try again.",
      );
      setIsSaving(false);
      return;
    }

    setHandle(normalizedHandle);
    setIsSaving(false);
    router.refresh();
  }

  return (
    <form onSubmit={saveProfile} className="mt-8 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display-name">Display name</Label>
        <Input
          id="display-name"
          required
          maxLength={80}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="handle">Handle</Label>
        <Input
          id="handle"
          required
          maxLength={40}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={handle}
          onChange={(event) => setHandle(event.target.value.toLowerCase())}
        />
        <p className="text-sm text-muted-foreground">
          Lowercase letters, numbers, underscores, and hyphens only.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Short bio</Label>
        <textarea
          id="bio"
          maxLength={280}
          rows={3}
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : hasProfile ? "Save changes" : "Create profile"}
      </Button>
    </form>
  );
}
