# Be4Best Furniture V2

Ultra-premium, Cloudflare-native Next.js 15 website for Be4Best Furniture.

## Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion 12
- **i18n**: next-intl v4 (TR + EN)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages + Workers
- **Database**: Cloudflare D1 (SQLite)
- **Assets**: Cloudflare R2

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_MEDIA_BASE_URL=https://pub-fb20589839af46f69072388882397132.r2.dev
CLOUDFLARE_D1_DATABASE_ID=your-d1-database-id
CLOUDFLARE_ACCOUNT_ID=your-account-id
NEXT_PUBLIC_SITE_URL=https://be4best.com
```

### 3. Set up D1 database

```bash
# Create the database
wrangler d1 create b4best-assets

# Update the database_id in wrangler.toml

# Run migrations
npm run db:migrate
npm run db:seed
```

### 4. Run locally

```bash
# Standard Next.js dev (no D1 — uses static fallback data)
npm run dev

# With Cloudflare bindings (D1 available)
npm run preview
```

## Deployment

```bash
# Build for Cloudflare Pages
npm run build:cf

# Deploy
npm run deploy
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_MEDIA_BASE_URL` | R2 public URL root. **Only change this when DNS moves.** `NEXT_PUBLIC_` prefix makes it available in Client Components. |
| `CLOUDFLARE_D1_DATABASE_ID` | D1 database ID from Cloudflare dashboard |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used in metadata, JSON-LD, sitemap) |

## Asset URL Helpers

**Never hardcode asset URLs.** Use the helpers in `src/lib/assets/urls.ts`:

```typescript
import { collectionAsset, assetUrl } from '@/lib/assets/urls';

// Collection asset
const heroUrl = collectionAsset('dubai', 'homepage', 'dubai-hero-01.jpeg');

// Generic asset
const logoUrl = assetUrl('brand/logo.svg');
```

## i18n

All user-visible strings live in `messages/{locale}/*.json`. **Never write hardcoded strings in components.**

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('home.hero');
// t('title') → reads from messages/tr/home.json or messages/en/home.json
```

## Collections

7 collections available: `dubai`, `milano`, `havai`, `toronto`, `lyon`, `paris`, `lasvegas`

Collection pages are pre-rendered with ISR (revalidate: 3600s).

## Admin Panel (Future)

The architecture is prepared for admin panel addition:
- `src/app/admin/` — route placeholder
- `src/lib/cloudflare/d1.ts` — write operations ready
- `src/lib/cloudflare/r2-upload.ts` — stub for R2 upload
- `admins` table in D1 schema
