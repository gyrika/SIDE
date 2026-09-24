"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createProfileDraft, publishProfile } from "@/app/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PrivateProfileContext, ProfileDraft } from "@/lib/profile";

type ProfileOnboardingProps = {
  initialContext: PrivateProfileContext | null;
};

const QUESTIONS: Array<{
  key: keyof PrivateProfileContext;
  prompt: string;
}> = [
  { key: "study_or_work", prompt: "What do you study or do?" },
  {
    key: "strengths_or_learning",
    prompt: "What are you good at or currently learning?",
  },
  { key: "interests", prompt: "What are you interested in?" },
  {
    key: "connection_goals",
    prompt: "What kinds of people, projects, or opportunities would you like to meet?",
  },
];

const EMPTY_CONTEXT: PrivateProfileContext = {
  study_or_work: "",
  strengths_or_learning: "",
  interests: "",
  connection_goals: "",
};

export function ProfileOnboarding({ initialContext }: ProfileOnboardingProps) {
  const [context, setContext] = useState(initialContext ?? EMPTY_CONTEXT);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const router = useRouter();
  const question = QUESTIONS[step];

  async function continueOnboarding(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!context[question.key].trim()) {
      setError("A short answer is enough.");
      return;
    }

    setError(null);

    if (step < QUESTIONS.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    setIsWorking(true);
    const result = await createProfileDraft(context);
    setIsWorking(false);

    if (result.error || !result.draft) {
      setError(result.error ?? "We could not prepare a profile draft.");
      return;
    }

    setDraft(result.draft);
  }

  async function useDraft() {
    if (!draft) {
      return;
    }

    setError(null);
    setIsWorking(true);
    const result = await publishProfile(draft);
    setIsWorking(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
  }

  function tellSideMore() {
    setDraft(null);
    setIsEditing(false);
    setStep(0);
    setError(null);
  }

  if (draft) {
    return (
      <section className="mt-10">
        <h1 className="text-3xl font-semibold">Here&apos;s how I would introduce you.</h1>
        {isEditing ? (
          <div className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="draft-display-name">Display name</Label>
              <Input
                id="draft-display-name"
                maxLength={80}
                value={draft.display_name}
                onChange={(event) =>
                  setDraft({ ...draft, display_name: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="draft-handle">Handle</Label>
              <Input
                id="draft-handle"
                maxLength={40}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={draft.suggested_handle}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    suggested_handle: event.target.value.toLowerCase(),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="draft-bio">Short bio</Label>
              <textarea
                id="draft-bio"
                maxLength={280}
                rows={3}
                value={draft.bio}
                onChange={(event) => setDraft({ ...draft, bio: event.target.value })}
                className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        ) : (
          <div className="mt-8 border-y py-6">
            <p className="text-xl font-medium">{draft.display_name}</p>
            <p className="mt-1 text-sm text-muted-foreground">@{draft.suggested_handle}</p>
            <p className="mt-5 leading-7 text-muted-foreground">{draft.bio}</p>
          </div>
        )}
        {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={useDraft} disabled={isWorking}>
            {isWorking ? "Saving..." : "Use this"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing((editing) => !editing)}
            disabled={isWorking}
          >
            {isEditing ? "Done editing" : "Edit"}
          </Button>
          <Button type="button" variant="ghost" onClick={tellSideMore} disabled={isWorking}>
            Tell SIDE more
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <h1 className="max-w-lg text-3xl font-semibold">
        Before I represent you, I&apos;d like to know you a little.
      </h1>
      <form onSubmit={continueOnboarding} className="mt-12">
        <p className="text-sm text-muted-foreground">
          {step + 1} of {QUESTIONS.length}
        </p>
        <label htmlFor={question.key} className="mt-4 block text-xl font-medium">
          {question.prompt}
        </label>
        <textarea
          id={question.key}
          required
          maxLength={500}
          rows={4}
          autoFocus
          value={context[question.key]}
          onChange={(event) =>
            setContext({ ...context, [question.key]: event.target.value })
          }
          className="mt-6 flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
        />
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <div className="mt-8 flex items-center gap-3">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setError(null);
                setStep((currentStep) => currentStep - 1);
              }}
              disabled={isWorking}
            >
              Back
            </Button>
          ) : null}
          <Button type="submit" disabled={isWorking}>
            {isWorking
              ? "Preparing..."
              : step === QUESTIONS.length - 1
                ? "Show my profile"
                : "Continue"}
          </Button>
        </div>
      </form>
    </section>
  );
}
