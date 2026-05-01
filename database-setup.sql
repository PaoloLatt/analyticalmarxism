-- ============================================================
-- Analytical Marxism — Database Setup
-- Run this ONCE in Supabase SQL Editor:
--   supabase.com → Your Project → SQL Editor → paste → Run
-- ============================================================

-- Thinkers (no foreign keys, create first)
CREATE TABLE IF NOT EXISTS "Thinker" (
  "id"           TEXT PRIMARY KEY,
  "slug"         TEXT NOT NULL UNIQUE,
  "name"         TEXT NOT NULL,
  "birthYear"    INTEGER,
  "deathYear"    INTEGER,
  "nationality"  TEXT,
  "photoUrl"     TEXT,
  "shortBio"     TEXT NOT NULL DEFAULT '',
  "fullBio"      TEXT NOT NULL DEFAULT '',
  "contribution" TEXT NOT NULL DEFAULT '',
  "keyWorks"     TEXT NOT NULL DEFAULT '[]',
  "connections"  TEXT,
  "published"    BOOLEAN NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts (FK to Thinker)
CREATE TABLE IF NOT EXISTS "Post" (
  "id"          TEXT PRIMARY KEY,
  "slug"        TEXT NOT NULL UNIQUE,
  "title"       TEXT NOT NULL,
  "excerpt"     TEXT NOT NULL,
  "content"     TEXT NOT NULL,
  "coverImage"  TEXT,
  "category"    TEXT NOT NULL,
  "difficulty"  TEXT NOT NULL DEFAULT 'introductory',
  "published"   BOOLEAN NOT NULL DEFAULT false,
  "featured"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "authorId"    TEXT REFERENCES "Thinker"("id") ON DELETE SET NULL
);

-- Infographics (FK to Thinker)
CREATE TABLE IF NOT EXISTS "Infographic" (
  "id"          TEXT PRIMARY KEY,
  "slug"        TEXT NOT NULL UNIQUE,
  "title"       TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl"    TEXT,
  "embedHtml"   TEXT,
  "type"        TEXT NOT NULL,
  "videoUrl"    TEXT,
  "published"   BOOLEAN NOT NULL DEFAULT false,
  "featured"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "thinkerId"   TEXT REFERENCES "Thinker"("id") ON DELETE SET NULL
);

-- Articles
CREATE TABLE IF NOT EXISTS "Article" (
  "id"        TEXT PRIMARY KEY,
  "slug"      TEXT NOT NULL UNIQUE,
  "title"     TEXT NOT NULL,
  "subtitle"  TEXT,
  "author"    TEXT NOT NULL,
  "excerpt"   TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Resources
CREATE TABLE IF NOT EXISTS "Resource" (
  "id"          TEXT PRIMARY KEY,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "url"         TEXT,
  "type"        TEXT NOT NULL,
  "difficulty"  TEXT NOT NULL DEFAULT 'introductory',
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Glossary
CREATE TABLE IF NOT EXISTS "GlossaryTerm" (
  "id"           TEXT PRIMARY KEY,
  "term"         TEXT NOT NULL UNIQUE,
  "definition"   TEXT NOT NULL,
  "relatedTerms" TEXT,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site settings (key-value store)
CREATE TABLE IF NOT EXISTS "SiteSettings" (
  "key"       TEXT PRIMARY KEY,
  "value"     TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social accounts
CREATE TABLE IF NOT EXISTS "SocialAccount" (
  "id"          TEXT PRIMARY KEY,
  "platform"    TEXT NOT NULL,
  "accountName" TEXT NOT NULL,
  "accessToken" TEXT,
  "enabled"     BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social posts (FK to SocialAccount)
CREATE TABLE IF NOT EXISTS "SocialPost" (
  "id"          TEXT PRIMARY KEY,
  "postId"      TEXT,
  "platform"    TEXT NOT NULL,
  "content"     TEXT NOT NULL,
  "status"      TEXT NOT NULL DEFAULT 'draft',
  "publishedAt" TIMESTAMPTZ,
  "externalId"  TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "accountId"   TEXT REFERENCES "SocialAccount"("id") ON DELETE SET NULL
);

-- ============================================================
-- Done! Now go back to Codespace and run: npm run db:seed
-- ============================================================
