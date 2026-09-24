"use server";

import { revalidatePath } from "next/cache";

import { generateProfileFromContext } from "@/lib/profile-generator";
import type { PrivateProfileContext, ProfileDraft } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

const HANDLE_PATTERN = /^[a-z0-9_-]+$/;

type ActionResult = {
  error?: string;
};

type DraftResult = ActionResult & {
  draft?: ProfileDraft;
};

function normalizeContext(context: PrivateProfileContext): PrivateProfileContext | null {
  const normalized = {
    study_or_work: context.study_or_work.trim(),
    strengths_or_learning: context.strengths_or_learning.trim(),
    interests: context.interests.trim(),
    connection_goals: context.connection_goals.trim(),
  };

  if (Object.values(normalized).some((value) => value.length === 0 || value.length > 500)) {
    return null;
  }

  return normalized;
}

async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  const email = data?.claims?.email;

  if (error || typeof id !== "string") {
    return null;
  }

  return {
    id,
    email: typeof email === "string" ? email : undefined,
    supabase,
  };
}

async function suggestAvailableHandle(
  supabase: Awaited<ReturnType<typeof createClient>>,
  suggestedHandle: string,
  userId: string,
) {
  const base = suggestedHandle.slice(0, 32);

  for (let suffix = 1; suffix <= 50; suffix += 1) {
    const candidate = suffix === 1 ? base : `${base.slice(0, 32 - `${suffix}`.length - 1)}-${suffix}`;
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("handle", candidate)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return candidate;
    }
  }

  return `${base.slice(0, 27)}-${userId.slice(0, 4)}`;
}

export async function createProfileDraft(
  context: PrivateProfileContext,
): Promise<DraftResult> {
  const normalizedContext = normalizeContext(context);

  if (!normalizedContext) {
    return { error: "Please answer each question in a few words." };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "Please sign in again before continuing." };
  }

  const { error: contextError } = await currentUser.supabase
    .from("private_profile_context")
    .upsert({ id: currentUser.id, ...normalizedContext }, { onConflict: "id" });

  if (contextError) {
    return { error: "We could not save what you shared. Please try again." };
  }

  try {
    const draft = generateProfileFromContext({
      ...normalizedContext,
      identityHint: currentUser.email?.split("@")[0],
    });
    const suggestedHandle = await suggestAvailableHandle(
      currentUser.supabase,
      draft.suggested_handle,
      currentUser.id,
    );

    return { draft: { ...draft, suggested_handle: suggestedHandle } };
  } catch {
    return { error: "We could not prepare a profile draft. Please try again." };
  }
}

export async function publishProfile(draft: ProfileDraft): Promise<ActionResult> {
  const displayName = draft.display_name.trim();
  const handle = draft.suggested_handle.trim().toLowerCase();
  const bio = draft.bio.trim();

  if (
    displayName.length === 0 ||
    displayName.length > 80 ||
    !HANDLE_PATTERN.test(handle) ||
    bio.length > 280
  ) {
    return { error: "Please check the proposed profile details and try again." };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return { error: "Please sign in again before continuing." };
  }

  const { data: context, error: contextError } = await currentUser.supabase
    .from("private_profile_context")
    .select("id")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (contextError || !context) {
    return { error: "Tell SIDE a little about yourself before publishing." };
  }

  const { error: profileError } = await currentUser.supabase
    .from("profiles")
    .insert({
      id: currentUser.id,
      display_name: displayName,
      handle,
      bio,
    });

  if (profileError) {
    return {
      error:
        profileError.code === "23505"
          ? "That handle is already in use."
          : "We could not publish your profile. Please try again.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/people");
  revalidatePath(`/u/${handle}`);

  return {};
}
