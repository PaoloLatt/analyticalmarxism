# Analytical Marxism

> *Clarity about capitalism* — An open educational website exploring Marxist questions with the tools of analytic philosophy, game theory, and social science.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind CSS
- **Backend/API:** Next.js API Routes (REST)
- **Database:** SQLite via Prisma ORM
- **Content:** Markdown-based posts rendered with react-markdown
- **Typography:** Playfair Display (headings) + DM Sans (body) + JetBrains Mono (code)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in values
cp .env.example .env.local

# 3. Initialize database, run migration, and seed with content
npm run setup

# 4. Start dev server
npm run dev
```

The site will be available at `http://localhost:3000`.
Admin panel at `http://localhost:3000/admin`.

## Project Structure

```
analytical-marxism/
├── prisma/
│   └── schema.prisma          # Data models (Post, Thinker, Infographic, etc.)
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage (compact masthead + card grid)
│   │   ├── blog/               # Blog listing + [slug] detail pages
│   │   ├── thinkers/           # Thinker profiles listing + [slug] detail
│   │   ├── visual-explainers/  # Infographic / diagram gallery
│   │   ├── articles/           # Long-form essays listing
│   │   ├── resources/          # Reading lists + glossary
│   │   ├── privacy-policy/     # GDPR-compliant privacy policy
│   │   ├── admin/              # Admin panel (dashboard, posts, thinkers, social)
│   │   └── api/                # REST API routes
│   ├── components/
│   │   ├── Sidebar.tsx         # Persistent left sidebar with collapsible nav
│   │   ├── TopBar.tsx          # Compact top bar: breadcrumbs, search, social icons
│   │   ├── LayoutShell.tsx     # Client shell: wires sidebar + topbar for public pages
│   │   ├── AdminSidebar.tsx    # Admin-specific sidebar (dark theme)
│   │   ├── BlogCard.tsx        # Compact blog post card
│   │   ├── ThinkerCard.tsx     # Thinker profile card
│   │   ├── ShareButtons.tsx    # Per-post social share buttons (consent-gated)
│   │   ├── GTMScript.tsx       # GTM injection (loads only after analytics consent)
│   │   ├── TrackPageView.tsx   # Client component to fire dataLayer events
│   │   ├── CookieConsent.tsx   # GDPR cookie banner + preferences modal
│   │   ├── Footer.tsx          # Site footer with links + cookie settings trigger
│   │   ├── Header.tsx          # Legacy header (not used in current layout)
│   │   └── SectionHeader.tsx   # Reusable section heading
│   └── lib/
│       ├── db.ts               # Prisma client singleton
│       ├── seed.ts             # Database seed with real content
│       ├── analytics.ts        # trackEvent() utility + dataLayer helpers
│       └── config.ts           # Site config: social links, site metadata
├── .env.example                # Environment variable template
├── tailwind.config.js          # Design system (colors, typography, spacing)
└── package.json
```

## Layout Architecture

The site uses a **persistent sidebar** layout (240 px, fixed left) with a compact top bar:

- **Public pages** (`/`, `/blog`, `/thinkers`, etc.): rendered inside `LayoutShell` which provides `Sidebar` + `TopBar` + `Footer`.
- **Admin pages** (`/admin/**`): `LayoutShell` detects the `/admin` prefix and passes children through; `AdminLayout` provides its own dark sidebar.
- **Mobile**: sidebar collapses into a slide-out drawer triggered by the hamburger icon in `TopBar`.

## Content Management

### Admin Panel (`/admin`)
The built-in admin panel lets you:
- Create, edit, publish/unpublish, and delete **blog posts** (with Markdown editor)
- Create and manage **thinker profiles**
- View content stats on the dashboard
- Manage **social accounts** and compose/track social posts (`/admin/social`)

### API Endpoints

| Endpoint                    | Methods          | Description                    |
|-----------------------------|------------------|--------------------------------|
| `/api/posts`                | GET, POST        | List / create posts            |
| `/api/posts/[id]`           | GET, PUT, DELETE | Read / update / delete post    |
| `/api/thinkers`             | GET, POST        | List / create thinkers         |
| `/api/thinkers/[id]`        | GET, PUT, DELETE | Read / update / delete thinker |
| `/api/infographics`         | GET, POST        | List / create infographics     |
| `/api/social/accounts`      | GET, POST, DELETE| Social account management      |
| `/api/social/posts`         | GET, POST, PUT   | Social post compose & history  |

### Database Commands
```bash
npm run db:generate    # Regenerate Prisma client
npm run db:migrate     # Run pending migrations
npm run db:seed        # Re-seed the database
npm run db:studio      # Open Prisma Studio (visual DB editor)
```

## Analytics Setup (Phase 2)

Google Analytics 4 is loaded **through Google Tag Manager** and only fires after the visitor accepts analytics cookies.

### Setup steps:
1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` to your GTM container ID
3. Inside GTM, create a **GA4 Configuration** tag using `NEXT_PUBLIC_GA4_ID` as the Measurement ID
4. The GTM script is injected by `GTMScript.tsx` only when `cookie_consent` cookie contains `{"analytics": true}`

### Custom events
Use `trackEvent()` from `src/lib/analytics.ts` or the pre-built helpers in `track.*`:

```ts
import { track } from '@/lib/analytics';

track.articleRead(slug, title);
track.thinkerViewed(slug, name);
track.resourceClicked(title, url);
track.shareClicked(platform, slug);
```

These push to `window.dataLayer` and are replayed by GTM once it loads.

## Cookie Consent (Phase 3)

The `CookieConsent` component provides a GDPR-compliant cookie banner with three categories:

| Category   | Always on | Controls                        |
|------------|-----------|----------------------------------|
| Necessary  | ✓         | `cookie_consent` cookie storage |
| Analytics  | Optional  | GTM / GA4 loading               |
| Social     | Optional  | Share buttons visibility        |

Consent is stored in the `cookie_consent` cookie (365-day expiry, JSON value).

Updating preferences dispatches a `cookieConsentUpdated` window event so GTM and share buttons respond immediately without a page reload.

The **"Cookie Settings"** link in the footer reopens the preferences modal at any time.

## Social Media (Phase 4)

### Frontend
- Social icons (Twitter/X, Facebook, Instagram, LinkedIn, YouTube) appear in the `TopBar`.
- **Share buttons** on each blog post share to Twitter/X, Facebook, LinkedIn, or copy the link. They are gated behind social cookie consent.
- Icon links and share URLs are configured in `src/lib/config.ts`.

### Backend (foundation)
`SocialAccount` and `SocialPost` Prisma models store connected accounts and post history.

The `/admin/social` page allows:
- Adding / removing connected social accounts
- Composing posts and saving as draft or marking as "published"
- Viewing post history with status tracking

**Actual OAuth flows and platform API calls are stubbed** — look for `// TODO` comments in `src/app/api/social/posts/route.ts` for the integration points.

## Design System

The site uses a compact, editorial design language inspired by Jacobin and Aeon:

- **Colors:** Warm cream/parchment backgrounds, deep burgundy accents, charcoal text
- **Typography:** Serif headings (Playfair Display) for intellectual authority, clean sans body (DM Sans)
- **Layout:** 240 px persistent sidebar, compact masthead homepage, 3-column card grids, dense information hierarchy
- **Components:** Badges for post categories, difficulty indicators, animated card hovers

## Seeded Content

The seed includes:
- **6 thinker profiles:** Cohen, Elster, Roemer, Wright, Van Parijs, Przeworski
- **4 blog posts:** "What Is Analytical Marxism?" (explainer), "Exploitation Without the Labor Theory of Value" (explainer), "AI, Automation, and Wright's Real Utopias" (commentary), "Reading Cohen's KMTH" (reading guide)
- **3 infographic placeholders** ready for visual content
- **8 resource entries** (key books at different difficulty levels)
- **9 glossary terms** covering core concepts
- **8 tags** for cross-referencing content

## Extending the Project

### Adding new content types
1. Add a model to `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Create an API route in `src/app/api/`
4. Add a listing page and detail page in `src/app/`
5. Add an admin management page in `src/app/admin/`

### Future enhancements
- **Authentication** for the admin panel (NextAuth.js)
- **Social OAuth flows** — wire up Twitter/LinkedIn APIs in `src/app/api/social/posts/route.ts`
- **Image uploads** (S3 or local storage)
- **Full-text search** (SQLite FTS or Algolia)
- **Comments / discussion** section
- **RSS feed** for the blog
- **Dark mode** toggle
- **i18n** (the topic has strong cross-language appeal)
- **Migration to PostgreSQL** for production deployment

## License

Content is provided for educational purposes. Code is MIT licensed.
