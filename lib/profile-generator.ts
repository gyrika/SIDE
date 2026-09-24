import "server-only";

import type { PrivateProfileContext, ProfileDraft } from "@/lib/profile";

type ProfileGenerationInput = PrivateProfileContext & {
  identityHint?: string;
};

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

function displayNameFromHint(identityHint?: string) {
  const words = (identityHint ?? "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3);

  if (words.length === 0) {
    return "SIDE member";
  }

  return words
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join(" ");
}

function handleFromText(value: string) {
  const handle = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  return handle || "side-member";
}

function shortBio(parts: string[]) {
  const bio = parts.filter(Boolean).join(" ");

  return bio.length <= 280 ? bio : `${bio.slice(0, 277).trimEnd()}...`;
}

// Replace this deterministic fallback with an approved AI provider later.
export function generateProfileFromContext(
  context: ProfileGenerationInput,
): ProfileDraft {
  const displayName = displayNameFromHint(context.identityHint);
  const studyOrWork = cleanText(context.study_or_work);
  const strengthsOrLearning = cleanText(context.strengths_or_learning);
  const interests = cleanText(context.interests);
  const connectionGoals = cleanText(context.connection_goals);

  const bio = shortBio([
    studyOrWork ? `${displayName} is focused on ${studyOrWork}.` : "",
    strengthsOrLearning ? `Currently learning ${strengthsOrLearning}.` : "",
    interests ? `Interested in ${interests}.` : "",
    connectionGoals ? `Open to meeting ${connectionGoals}.` : "",
  ]);

  return {
    display_name: displayName,
    suggested_handle: handleFromText(context.identityHint ?? displayName),
    bio: bio || "Here to learn, connect, and build with others.",
  };
}
