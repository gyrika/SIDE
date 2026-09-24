export type Profile = {
  id: string;
  display_name: string;
  handle: string;
  bio: string;
};

export type PrivateProfileContext = {
  study_or_work: string;
  strengths_or_learning: string;
  interests: string;
  connection_goals: string;
};

export type ProfileDraft = {
  display_name: string;
  suggested_handle: string;
  bio: string;
};
