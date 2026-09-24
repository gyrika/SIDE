import Link from "next/link";
import { Suspense } from "react";

import { AppNav } from "@/components/app-nav";
import type { Profile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

async function PeopleList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, handle, bio")
    .order("display_name", { ascending: true });

  if (error) {
    return <p className="mt-8 text-sm text-muted-foreground">Unable to load people.</p>;
  }

  const people = (data ?? []) as Profile[];

  if (people.length === 0) {
    return <p className="mt-8 text-sm text-muted-foreground">No profiles yet.</p>;
  }

  return (
    <ul className="mt-8 divide-y border-y">
      {people.map((person) => (
        <li key={person.id}>
          <Link
            href={`/u/${person.handle}`}
            className="block py-5 transition-colors hover:bg-accent/50"
          >
            <p className="font-medium">{person.display_name}</p>
            <p className="mt-1 text-sm text-muted-foreground">@{person.handle}</p>
            {person.bio ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{person.bio}</p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function PeoplePage() {
  return (
    <div className="min-h-screen">
      <AppNav />
      <main className="mx-auto w-full max-w-xl px-6 py-14">
        <p className="text-sm font-medium">People</p>
        <h1 className="mt-3 text-3xl font-semibold">SIDE users</h1>
        <Suspense fallback={null}>
          <PeopleList />
        </Suspense>
      </main>
    </div>
  );
}
