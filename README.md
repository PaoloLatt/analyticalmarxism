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

# 2. Initialize database, run migration, and seed with content
npm run setup

# 3. Start dev server
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
│   │   ├── page.tsx            # Homepage (magazine-style landing)
│   │   ├── blog/               # Blog listing + [slug] detail pages
│   │   ├── thinkers/           # Thinker profiles listing + [slug] detail
│   │   ├── visual-explainers/  # Infographic / diagram gallery
│   │   ├── articles/           # Long-form essays listing
│   │   ├── resources/          # Reading lists + glossary
│   │   ├── admin/              # Admin panel (dashboard, posts, thinkers)
│   │   └── api/                # REST API routes (posts, thinkers, infographics)
│   ├── components/             # Reusable UI components
│   └── lib/
│       ├── db.ts               # Prisma client singleton
│       └── seed.ts             # Database seed with real content
├── tailwind.config.js          # Design system (colors, typography, spacing)
└── package.json
```

## Content Management

### Admin Panel (`/admin`)
The built-in admin panel lets you:
- Create, edit, publish/unpublish, and delete **blog posts** (with Markdown editor)
- Create and manage **thinker profiles**
- View content stats on the dashboard

### API Endpoints
All content is also manageable via REST API:

| Endpoint                 | Methods          | Description                   |
|--------------------------|------------------|-------------------------------|
| `/api/posts`             | GET, POST        | List / create posts           |
| `/api/posts/[id]`        | GET, PUT, DELETE | Read / update / delete post   |
| `/api/thinkers`          | GET, POST        | List / create thinkers        |
| `/api/thinkers/[id]`     | GET, PUT, DELETE | Read / update / delete thinker|
| `/api/infographics`      | GET, POST        | List / create infographics    |

### Database Commands
```bash
npm run db:generate    # Regenerate Prisma client
npm run db:migrate     # Run pending migrations
npm run db:seed        # Re-seed the database
npm run db:studio      # Open Prisma Studio (visual DB editor)
```

## Seeded Content

The seed includes:
- **6 thinker profiles:** Cohen, Elster, Roemer, Wright, Van Parijs, Przeworski
- **4 blog posts:** "What Is Analytical Marxism?" (explainer), "Exploitation Without the Labor Theory of Value" (explainer), "AI, Automation, and Wright's Real Utopias" (commentary), "Reading Cohen's KMTH" (reading guide)
- **3 infographic placeholders** ready for visual content
- **8 resource entries** (key books at different difficulty levels)
- **9 glossary terms** covering core concepts
- **8 tags** for cross-referencing content

## Design System

The site uses an editorial design language:
- **Colors:** Warm cream/parchment backgrounds, deep burgundy accents, charcoal text
- **Typography:** Serif headings (Playfair Display) for intellectual authority, clean sans body (DM Sans) for readability
- **Layout:** Magazine-style homepage, card-based listings, generous whitespace
- **Components:** Badges for post categories, difficulty indicators, animated card lifts

## Extending the Project

### Adding new content types
1. Add a model to `prisma/schema.prisma`
2. Run `npm run db:migrate`
3. Create an API route in `src/app/api/`
4. Add a listing page and detail page in `src/app/`
5. Add an admin management page in `src/app/admin/`

### Future enhancements to consider
- **Authentication** for the admin panel (NextAuth.js)
- **Image uploads** (S3 or local storage)
- **Search** (full-text search via SQLite FTS or external service)
- **Comments / discussion** section
- **RSS feed** for the blog
- **Dark mode** toggle
- **i18n** (the topic has strong appeal across languages)
- **Migration to PostgreSQL** for production deployment

## License

Content is provided for educational purposes. Code is MIT licensed.
