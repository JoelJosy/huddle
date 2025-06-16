create table "public"."daily_stats" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "date" date default CURRENT_DATE,
    "minutes_studied" integer default 0,
    "cards_reviewed" integer default 0,
    "notes_created" integer default 0,
    "points_earned" integer default 0
);


alter table "public"."daily_stats" enable row level security;

create table "public"."flashcards" (
    "id" uuid not null default gen_random_uuid(),
    "question" text not null,
    "answer" text not null,
    "note_id" uuid,
    "user_id" uuid,
    "difficulty" integer default 0,
    "ease_factor" real default 2.5,
    "interval" integer default 1,
    "repetitions" integer default 0,
    "next_review" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
);


alter table "public"."flashcards" enable row level security;

create table "public"."group_members" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid,
    "user_id" uuid,
    "role" text default 'member'::text,
    "joined_at" timestamp with time zone default now(),
    "last_active" timestamp with time zone default now()
);


alter table "public"."group_members" enable row level security;

create table "public"."group_messages" (
    "id" uuid not null default gen_random_uuid(),
    "group_id" uuid,
    "user_id" uuid,
    "content" text not null,
    "message_type" text default 'text'::text,
    "file_url" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."group_messages" enable row level security;

create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content_url" text,
    "excerpt" text,
    "subject_id" uuid,
    "user_id" uuid,
    "is_public" boolean default false,
    "word_count" integer default 0,
    "tags" text[],
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "group_id" uuid,
    "visibility" text default 'public'::text
);


alter table "public"."notes" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "username" text,
    "avatar_url" text,
    "study_streak" integer default 0,
    "total_points" integer default 0,
    "created_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."study_groups" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "description" text,
    "owner_id" uuid,
    "is_public" boolean default true,
    "max_members" integer default 20,
    "invite_code" text,
    "member_count" integer default 1,
    "created_at" timestamp with time zone default now()
);


alter table "public"."study_groups" enable row level security;

create table "public"."study_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "subject_id" uuid,
    "session_type" text default 'flashcards'::text,
    "duration_minutes" integer,
    "cards_studied" integer default 0,
    "correct_answers" integer default 0,
    "points_earned" integer default 0,
    "date" date default CURRENT_DATE,
    "created_at" timestamp with time zone default now()
);


alter table "public"."study_sessions" enable row level security;

create table "public"."subjects" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "color" text default '#48e5c2'::text,
    "user_id" uuid,
    "is_public" boolean default true,
    "created_at" timestamp with time zone default now()
);


alter table "public"."subjects" enable row level security;

CREATE UNIQUE INDEX daily_stats_pkey ON public.daily_stats USING btree (id);

CREATE UNIQUE INDEX daily_stats_user_id_date_key ON public.daily_stats USING btree (user_id, date);

CREATE UNIQUE INDEX flashcards_pkey ON public.flashcards USING btree (id);

CREATE UNIQUE INDEX group_members_group_id_user_id_key ON public.group_members USING btree (group_id, user_id);

CREATE UNIQUE INDEX group_members_pkey ON public.group_members USING btree (id);

CREATE UNIQUE INDEX group_messages_pkey ON public.group_messages USING btree (id);

CREATE INDEX idx_daily_stats_user_date ON public.daily_stats USING btree (user_id, date DESC);

CREATE INDEX idx_flashcards_next_review ON public.flashcards USING btree (next_review);

CREATE INDEX idx_group_members_group_id ON public.group_members USING btree (group_id);

CREATE INDEX idx_group_members_user_id ON public.group_members USING btree (user_id);

CREATE INDEX idx_group_messages_created_at ON public.group_messages USING btree (created_at DESC);

CREATE INDEX idx_group_messages_group_created ON public.group_messages USING btree (group_id, created_at DESC);

CREATE INDEX idx_group_messages_group_id ON public.group_messages USING btree (group_id);

CREATE INDEX idx_group_messages_user_id ON public.group_messages USING btree (user_id);

CREATE INDEX idx_notes_created_at ON public.notes USING btree (created_at DESC);

CREATE INDEX idx_notes_excerpt_gin ON public.notes USING gin (to_tsvector('english'::regconfig, excerpt));

CREATE INDEX idx_notes_is_public ON public.notes USING btree (is_public);

CREATE INDEX idx_notes_public_created ON public.notes USING btree (is_public, visibility, created_at DESC) WHERE ((is_public = true) AND (visibility = 'public'::text));

CREATE INDEX idx_notes_subject ON public.notes USING btree (subject_id);

CREATE INDEX idx_notes_subject_id ON public.notes USING btree (subject_id);

CREATE INDEX idx_notes_tags ON public.notes USING gin (tags);

CREATE INDEX idx_notes_tags_gin ON public.notes USING gin (tags);

CREATE INDEX idx_notes_title_gin ON public.notes USING gin (to_tsvector('english'::regconfig, title));

CREATE INDEX idx_notes_user_created ON public.notes USING btree (user_id, created_at DESC);

CREATE INDEX idx_notes_user_id ON public.notes USING btree (user_id);

CREATE INDEX idx_notes_visibility_created ON public.notes USING btree (visibility, created_at DESC);

CREATE INDEX idx_notes_visibility_created_at ON public.notes USING btree (visibility, created_at DESC);

CREATE INDEX idx_profiles_user_lookup ON public.profiles USING btree (id, full_name, email, username, avatar_url);

CREATE INDEX idx_profiles_username ON public.profiles USING btree (username);

CREATE INDEX idx_study_groups_created_at ON public.study_groups USING btree (created_at DESC);

CREATE INDEX idx_study_groups_description_gin ON public.study_groups USING gin (to_tsvector('english'::regconfig, description));

CREATE INDEX idx_study_groups_is_public ON public.study_groups USING btree (is_public);

CREATE INDEX idx_study_groups_name_gin ON public.study_groups USING gin (to_tsvector('english'::regconfig, name));

CREATE INDEX idx_study_groups_owner ON public.study_groups USING btree (owner_id);

CREATE INDEX idx_study_groups_public_created_at ON public.study_groups USING btree (is_public, created_at DESC);

CREATE INDEX idx_subjects_name_gin ON public.subjects USING gin (to_tsvector('english'::regconfig, name));

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX study_groups_invite_code_key ON public.study_groups USING btree (invite_code);

CREATE UNIQUE INDEX study_groups_pkey ON public.study_groups USING btree (id);

CREATE UNIQUE INDEX study_sessions_pkey ON public.study_sessions USING btree (id);

CREATE UNIQUE INDEX subjects_pkey ON public.subjects USING btree (id);

alter table "public"."daily_stats" add constraint "daily_stats_pkey" PRIMARY KEY using index "daily_stats_pkey";

alter table "public"."flashcards" add constraint "flashcards_pkey" PRIMARY KEY using index "flashcards_pkey";

alter table "public"."group_members" add constraint "group_members_pkey" PRIMARY KEY using index "group_members_pkey";

alter table "public"."group_messages" add constraint "group_messages_pkey" PRIMARY KEY using index "group_messages_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."study_groups" add constraint "study_groups_pkey" PRIMARY KEY using index "study_groups_pkey";

alter table "public"."study_sessions" add constraint "study_sessions_pkey" PRIMARY KEY using index "study_sessions_pkey";

alter table "public"."subjects" add constraint "subjects_pkey" PRIMARY KEY using index "subjects_pkey";

alter table "public"."daily_stats" add constraint "daily_stats_user_id_date_key" UNIQUE using index "daily_stats_user_id_date_key";

alter table "public"."daily_stats" add constraint "daily_stats_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."daily_stats" validate constraint "daily_stats_user_id_fkey";

alter table "public"."flashcards" add constraint "flashcards_note_id_fkey" FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE not valid;

alter table "public"."flashcards" validate constraint "flashcards_note_id_fkey";

alter table "public"."flashcards" add constraint "flashcards_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."flashcards" validate constraint "flashcards_user_id_fkey";

alter table "public"."group_members" add constraint "group_members_group_id_fkey" FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE not valid;

alter table "public"."group_members" validate constraint "group_members_group_id_fkey";

alter table "public"."group_members" add constraint "group_members_group_id_user_id_key" UNIQUE using index "group_members_group_id_user_id_key";

alter table "public"."group_members" add constraint "group_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."group_members" validate constraint "group_members_user_id_fkey";

alter table "public"."group_messages" add constraint "group_messages_group_id_fkey" FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE not valid;

alter table "public"."group_messages" validate constraint "group_messages_group_id_fkey";

alter table "public"."group_messages" add constraint "group_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."group_messages" validate constraint "group_messages_user_id_fkey";

alter table "public"."notes" add constraint "notes_group_id_fkey" FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_group_id_fkey";

alter table "public"."notes" add constraint "notes_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_subject_id_fkey";

alter table "public"."notes" add constraint "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."notes" validate constraint "notes_user_id_fkey";

alter table "public"."notes" add constraint "notes_visibility_check" CHECK ((visibility = ANY (ARRAY['private'::text, 'group'::text, 'public'::text]))) not valid;

alter table "public"."notes" validate constraint "notes_visibility_check";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."study_groups" add constraint "study_groups_invite_code_key" UNIQUE using index "study_groups_invite_code_key";

alter table "public"."study_groups" add constraint "study_groups_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."study_groups" validate constraint "study_groups_owner_id_fkey";

alter table "public"."study_sessions" add constraint "study_sessions_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES subjects(id) not valid;

alter table "public"."study_sessions" validate constraint "study_sessions_subject_id_fkey";

alter table "public"."study_sessions" add constraint "study_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."study_sessions" validate constraint "study_sessions_user_id_fkey";

alter table "public"."subjects" add constraint "subjects_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."subjects" validate constraint "subjects_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.delete_subject_if_no_notes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  RAISE NOTICE 'Checking subject_id %', OLD.subject_id;

  IF NOT EXISTS (
    SELECT 1 FROM notes WHERE subject_id = OLD.subject_id
  ) THEN
    RAISE NOTICE 'Deleting subject_id %', OLD.subject_id;
    DELETE FROM subjects WHERE id = OLD.subject_id;
  END IF;

  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_note_with_profile_optimized(note_id uuid)
 RETURNS TABLE(id uuid, title text, excerpt text, content_url text, tags text[], created_at timestamp with time zone, word_count integer, user_id uuid, subject_name text, profile_id uuid, full_name text, email text, username text, avatar_url text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.excerpt,
    n.content_url,
    n.tags,
    n.created_at,
    n.word_count,
    n.user_id,
    s.name as subject_name,
    p.id as profile_id,
    p.full_name,
    p.email,
    p.username,
    p.avatar_url
  FROM notes n
  LEFT JOIN subjects s ON n.subject_id = s.id
  LEFT JOIN profiles p ON n.user_id = p.id
  WHERE n.id = note_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_public_study_groups(search_term text DEFAULT ''::text, page_limit integer DEFAULT 10, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, name text, description text, member_count integer, created_at timestamp with time zone, owner_name text, owner_id uuid, total_count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH filtered_groups AS (
    SELECT 
      sg.id,
      sg.name,
      sg.description,
      COALESCE(member_counts.count, 0)::integer as member_count,
      sg.created_at,
      p.full_name as owner_name,
      sg.owner_id,
      COUNT(*) OVER() as total_count
    FROM study_groups sg
    LEFT JOIN profiles p ON sg.owner_id = p.id
    LEFT JOIN (
      SELECT 
        group_id, 
        COUNT(*) as count 
      FROM group_members 
      GROUP BY group_id
    ) member_counts ON sg.id = member_counts.group_id
    AND (
      search_term = '' OR 
      sg.name ILIKE '%' || search_term || '%' OR 
      sg.description ILIKE '%' || search_term || '%' OR
      p.full_name ILIKE '%' || search_term || '%'
    )
    ORDER BY sg.created_at DESC
    LIMIT page_limit
    OFFSET page_offset
  )
  SELECT 
    fg.id,
    fg.name,
    fg.description,
    fg.member_count,
    fg.created_at,
    fg.owner_name,
    fg.owner_id,
    fg.total_count
  FROM filtered_groups fg;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  INSERT INTO public.profiles (id, email, full_name, username)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;$function$
;

CREATE OR REPLACE FUNCTION public.search_notes_optimized(search_term text DEFAULT ''::text, page_limit integer DEFAULT 10, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, title text, excerpt text, content_url text, tags text[], created_at timestamp with time zone, word_count integer, user_id uuid, subject_name text, full_name text, email text, username text, avatar_url text, total_count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH filtered_notes AS (
    SELECT 
      n.id,
      n.title,
      n.excerpt,
      n.content_url,
      n.tags,
      n.created_at,
      n.word_count,
      n.user_id,
      s.name as subject_name,
      p.full_name,
      p.email,
      p.username,
      p.avatar_url
    FROM notes n
    LEFT JOIN subjects s ON n.subject_id = s.id
    LEFT JOIN profiles p ON n.user_id = p.id
    WHERE 
      n.is_public = true 
      AND n.visibility = 'public'
      AND (
        search_term = '' 
        OR n.title ILIKE '%' || search_term || '%'
        OR n.excerpt ILIKE '%' || search_term || '%'
        OR EXISTS (
          SELECT 1 FROM unnest(n.tags) AS tag 
          WHERE tag ILIKE '%' || search_term || '%'
        )
        OR s.name ILIKE '%' || search_term || '%'
      )
    ORDER BY n.created_at DESC
  ),
  total_count AS (
    SELECT COUNT(*) as count FROM filtered_notes
  )
  SELECT 
    fn.*,
    tc.count as total_count
  FROM filtered_notes fn
  CROSS JOIN total_count tc
  LIMIT page_limit
  OFFSET page_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_user_term(p_user_id uuid, search_term text DEFAULT ''::text, page_limit integer DEFAULT 10, page_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, title text, excerpt text, content_url text, tags text[], created_at timestamp with time zone, word_count integer, user_id uuid, subject_name text, total_count bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH filtered_notes AS (
    SELECT 
      n.id, 
      n.title, 
      n.excerpt, 
      n.content_url, 
      n.tags, 
      n.created_at, 
      n.word_count, 
      n.user_id,
      s.name as subject_name
    FROM notes n
    LEFT JOIN subjects s ON n.subject_id = s.id
    WHERE n.user_id = p_user_id
    AND (
      search_term = '' OR 
      n.title ILIKE '%' || search_term || '%' OR 
      n.excerpt ILIKE '%' || search_term || '%' OR
      COALESCE(s.name, '') ILIKE '%' || search_term || '%'
    )
    ORDER BY n.created_at DESC
    LIMIT page_limit
    OFFSET page_offset
  ),
  total_count_query AS (
    SELECT COUNT(*)::bigint as total_count
    FROM notes n
    LEFT JOIN subjects s ON n.subject_id = s.id
    WHERE n.user_id = p_user_id
    AND (
      search_term = '' OR 
      n.title ILIKE '%' || search_term || '%' OR 
      n.excerpt ILIKE '%' || search_term || '%' OR
      COALESCE(s.name, '') ILIKE '%' || search_term || '%'
    )
  )
  SELECT 
    fn.id,
    fn.title,
    fn.excerpt,
    fn.content_url,
    fn.tags,
    fn.created_at,
    fn.word_count,
    fn.user_id,
    fn.subject_name,
    tc.total_count
  FROM filtered_notes fn
  CROSS JOIN total_count_query tc;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_last_active()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.group_members
  set last_active = now()
  where group_id = new.group_id and user_id = new.user_id;

  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."daily_stats" to "anon";

grant insert on table "public"."daily_stats" to "anon";

grant references on table "public"."daily_stats" to "anon";

grant select on table "public"."daily_stats" to "anon";

grant trigger on table "public"."daily_stats" to "anon";

grant truncate on table "public"."daily_stats" to "anon";

grant update on table "public"."daily_stats" to "anon";

grant delete on table "public"."daily_stats" to "authenticated";

grant insert on table "public"."daily_stats" to "authenticated";

grant references on table "public"."daily_stats" to "authenticated";

grant select on table "public"."daily_stats" to "authenticated";

grant trigger on table "public"."daily_stats" to "authenticated";

grant truncate on table "public"."daily_stats" to "authenticated";

grant update on table "public"."daily_stats" to "authenticated";

grant delete on table "public"."daily_stats" to "service_role";

grant insert on table "public"."daily_stats" to "service_role";

grant references on table "public"."daily_stats" to "service_role";

grant select on table "public"."daily_stats" to "service_role";

grant trigger on table "public"."daily_stats" to "service_role";

grant truncate on table "public"."daily_stats" to "service_role";

grant update on table "public"."daily_stats" to "service_role";

grant delete on table "public"."flashcards" to "anon";

grant insert on table "public"."flashcards" to "anon";

grant references on table "public"."flashcards" to "anon";

grant select on table "public"."flashcards" to "anon";

grant trigger on table "public"."flashcards" to "anon";

grant truncate on table "public"."flashcards" to "anon";

grant update on table "public"."flashcards" to "anon";

grant delete on table "public"."flashcards" to "authenticated";

grant insert on table "public"."flashcards" to "authenticated";

grant references on table "public"."flashcards" to "authenticated";

grant select on table "public"."flashcards" to "authenticated";

grant trigger on table "public"."flashcards" to "authenticated";

grant truncate on table "public"."flashcards" to "authenticated";

grant update on table "public"."flashcards" to "authenticated";

grant delete on table "public"."flashcards" to "service_role";

grant insert on table "public"."flashcards" to "service_role";

grant references on table "public"."flashcards" to "service_role";

grant select on table "public"."flashcards" to "service_role";

grant trigger on table "public"."flashcards" to "service_role";

grant truncate on table "public"."flashcards" to "service_role";

grant update on table "public"."flashcards" to "service_role";

grant delete on table "public"."group_members" to "anon";

grant insert on table "public"."group_members" to "anon";

grant references on table "public"."group_members" to "anon";

grant select on table "public"."group_members" to "anon";

grant trigger on table "public"."group_members" to "anon";

grant truncate on table "public"."group_members" to "anon";

grant update on table "public"."group_members" to "anon";

grant delete on table "public"."group_members" to "authenticated";

grant insert on table "public"."group_members" to "authenticated";

grant references on table "public"."group_members" to "authenticated";

grant select on table "public"."group_members" to "authenticated";

grant trigger on table "public"."group_members" to "authenticated";

grant truncate on table "public"."group_members" to "authenticated";

grant update on table "public"."group_members" to "authenticated";

grant delete on table "public"."group_members" to "service_role";

grant insert on table "public"."group_members" to "service_role";

grant references on table "public"."group_members" to "service_role";

grant select on table "public"."group_members" to "service_role";

grant trigger on table "public"."group_members" to "service_role";

grant truncate on table "public"."group_members" to "service_role";

grant update on table "public"."group_members" to "service_role";

grant delete on table "public"."group_messages" to "anon";

grant insert on table "public"."group_messages" to "anon";

grant references on table "public"."group_messages" to "anon";

grant select on table "public"."group_messages" to "anon";

grant trigger on table "public"."group_messages" to "anon";

grant truncate on table "public"."group_messages" to "anon";

grant update on table "public"."group_messages" to "anon";

grant delete on table "public"."group_messages" to "authenticated";

grant insert on table "public"."group_messages" to "authenticated";

grant references on table "public"."group_messages" to "authenticated";

grant select on table "public"."group_messages" to "authenticated";

grant trigger on table "public"."group_messages" to "authenticated";

grant truncate on table "public"."group_messages" to "authenticated";

grant update on table "public"."group_messages" to "authenticated";

grant delete on table "public"."group_messages" to "service_role";

grant insert on table "public"."group_messages" to "service_role";

grant references on table "public"."group_messages" to "service_role";

grant select on table "public"."group_messages" to "service_role";

grant trigger on table "public"."group_messages" to "service_role";

grant truncate on table "public"."group_messages" to "service_role";

grant update on table "public"."group_messages" to "service_role";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."study_groups" to "anon";

grant insert on table "public"."study_groups" to "anon";

grant references on table "public"."study_groups" to "anon";

grant select on table "public"."study_groups" to "anon";

grant trigger on table "public"."study_groups" to "anon";

grant truncate on table "public"."study_groups" to "anon";

grant update on table "public"."study_groups" to "anon";

grant delete on table "public"."study_groups" to "authenticated";

grant insert on table "public"."study_groups" to "authenticated";

grant references on table "public"."study_groups" to "authenticated";

grant select on table "public"."study_groups" to "authenticated";

grant trigger on table "public"."study_groups" to "authenticated";

grant truncate on table "public"."study_groups" to "authenticated";

grant update on table "public"."study_groups" to "authenticated";

grant delete on table "public"."study_groups" to "service_role";

grant insert on table "public"."study_groups" to "service_role";

grant references on table "public"."study_groups" to "service_role";

grant select on table "public"."study_groups" to "service_role";

grant trigger on table "public"."study_groups" to "service_role";

grant truncate on table "public"."study_groups" to "service_role";

grant update on table "public"."study_groups" to "service_role";

grant delete on table "public"."study_sessions" to "anon";

grant insert on table "public"."study_sessions" to "anon";

grant references on table "public"."study_sessions" to "anon";

grant select on table "public"."study_sessions" to "anon";

grant trigger on table "public"."study_sessions" to "anon";

grant truncate on table "public"."study_sessions" to "anon";

grant update on table "public"."study_sessions" to "anon";

grant delete on table "public"."study_sessions" to "authenticated";

grant insert on table "public"."study_sessions" to "authenticated";

grant references on table "public"."study_sessions" to "authenticated";

grant select on table "public"."study_sessions" to "authenticated";

grant trigger on table "public"."study_sessions" to "authenticated";

grant truncate on table "public"."study_sessions" to "authenticated";

grant update on table "public"."study_sessions" to "authenticated";

grant delete on table "public"."study_sessions" to "service_role";

grant insert on table "public"."study_sessions" to "service_role";

grant references on table "public"."study_sessions" to "service_role";

grant select on table "public"."study_sessions" to "service_role";

grant trigger on table "public"."study_sessions" to "service_role";

grant truncate on table "public"."study_sessions" to "service_role";

grant update on table "public"."study_sessions" to "service_role";

grant delete on table "public"."subjects" to "anon";

grant insert on table "public"."subjects" to "anon";

grant references on table "public"."subjects" to "anon";

grant select on table "public"."subjects" to "anon";

grant trigger on table "public"."subjects" to "anon";

grant truncate on table "public"."subjects" to "anon";

grant update on table "public"."subjects" to "anon";

grant delete on table "public"."subjects" to "authenticated";

grant insert on table "public"."subjects" to "authenticated";

grant references on table "public"."subjects" to "authenticated";

grant select on table "public"."subjects" to "authenticated";

grant trigger on table "public"."subjects" to "authenticated";

grant truncate on table "public"."subjects" to "authenticated";

grant update on table "public"."subjects" to "authenticated";

grant delete on table "public"."subjects" to "service_role";

grant insert on table "public"."subjects" to "service_role";

grant references on table "public"."subjects" to "service_role";

grant select on table "public"."subjects" to "service_role";

grant trigger on table "public"."subjects" to "service_role";

grant truncate on table "public"."subjects" to "service_role";

grant update on table "public"."subjects" to "service_role";

create policy "Users can insert/update own daily stats"
on "public"."daily_stats"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update own daily stats"
on "public"."daily_stats"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view own daily stats"
on "public"."daily_stats"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Anyone can view flashcards"
on "public"."flashcards"
as permissive
for select
to public
using (true);


create policy "Users can create own flashcards"
on "public"."flashcards"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete own flashcards"
on "public"."flashcards"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update own flashcards"
on "public"."flashcards"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Allow self-update of last_active"
on "public"."group_members"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can join groups"
on "public"."group_members"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can leave groups"
on "public"."group_members"
as permissive
for delete
to public
using (((auth.uid() = user_id) OR (auth.uid() IN ( SELECT study_groups.owner_id
   FROM study_groups
  WHERE (study_groups.id = group_members.group_id)))));


create policy "Users can view group members "
on "public"."group_members"
as permissive
for select
to public
using (true);


create policy "Group members can send messages"
on "public"."group_messages"
as permissive
for insert
to public
with check (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
   FROM group_members
  WHERE ((group_members.group_id = group_messages.group_id) AND (group_members.user_id = auth.uid()))))));


create policy "Group members can view messages"
on "public"."group_messages"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM group_members
  WHERE ((group_members.group_id = group_messages.group_id) AND (group_members.user_id = auth.uid())))));


create policy "Users can delete own notes"
on "public"."notes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own notes"
on "public"."notes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update own notes"
on "public"."notes"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view notes based on visibility"
on "public"."notes"
as permissive
for select
to public
using (((auth.uid() = user_id) OR (is_public = true) OR ((visibility = 'group'::text) AND (group_id IN ( SELECT group_members.group_id
   FROM group_members
  WHERE (group_members.user_id = auth.uid())))) OR (visibility = 'public'::text)));


create policy "Allow anyone to read profiles"
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Anyone can view study groups"
on "public"."study_groups"
as permissive
for select
to public
using (true);


create policy "Owners can delete their study groups"
on "public"."study_groups"
as permissive
for delete
to public
using ((auth.uid() = owner_id));


create policy "Owners can update their study groups"
on "public"."study_groups"
as permissive
for update
to public
using ((auth.uid() = owner_id));


create policy "Users can create study groups"
on "public"."study_groups"
as permissive
for insert
to public
with check ((auth.uid() = owner_id));


create policy "Users can create own study sessions"
on "public"."study_sessions"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view own study sessions"
on "public"."study_sessions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Allow anon to read subjects"
on "public"."subjects"
as permissive
for select
to anon
using (true);


create policy "Authenticated users can create subjects"
on "public"."subjects"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can read subjects"
on "public"."subjects"
as permissive
for select
to authenticated
using (true);


create policy "Authenticated users can update subjects"
on "public"."subjects"
as permissive
for update
to authenticated
using (true)
with check (true);


CREATE TRIGGER trg_update_last_active AFTER INSERT ON public.group_messages FOR EACH ROW EXECUTE FUNCTION update_last_active();

CREATE TRIGGER trigger_delete_subject_if_last_note AFTER DELETE ON public.notes FOR EACH ROW EXECUTE FUNCTION delete_subject_if_no_notes();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


