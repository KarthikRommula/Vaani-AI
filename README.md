# Vaani AI

**Vaani AI** is a voice-first portal that lets Indian citizens apply for government services by *speaking* in their own language instead of filling out forms by hand. Users select a service (Aadhaar, PAN, Passport, Ration Card, scholarships, pensions, and dozens more), answer each field by voice, and the application captures, normalizes, and submits their details — generating a QR-coded submission that service-desk admins can review and process.

The goal is to make government paperwork accessible to people who find typing or English-language forms difficult, by combining speech recognition, AI-assisted data extraction, and a multilingual conversational interface.

> Built with Next.js 16 (App Router) and React 19.

## Features

- **Voice-driven form filling** — every field in a service application is collected by speaking; the user is prompted in their chosen language and confirms each value before moving on.
- **12 Indian languages** — English, Hindi, Telugu, Kannada, Tamil, Malayalam, Marathi, Bengali, Gujarati, Odia, Punjabi, and Urdu, with native-script voice prompts and confirmation messages.
- **55+ government services** — Aadhaar update, PAN, Voter ID, Birth/Death/Marriage certificates, Passport, Driving License, Income/Caste/Residence certificates, pensions, scholarships, KCC, MGNREGA, GST, FSSAI, and many more (defined in `lib/government-services.ts`).
- **AI speech-to-text** — audio is transcribed using Groq's Whisper Large v3, with field-aware prompts that bias recognition toward the kind of value expected (names, dates, numbers).
- **Smart value normalization** — Google Gemini reformats spoken input into strict formats (e.g. dates to `YYYY-MM-DD`, "name at gmail dot com" to a valid email, 10-digit phone numbers, Aadhaar/PAN/IFSC/GSTIN patterns) while leaving name fields untouched.
- **AI government-services chatbot** — a Groq Llama 3.3 70B assistant ("Vaani AI Assistant") answers questions about schemes and certificates, replying strictly in the user's selected language.
- **Text-to-speech** — spoken prompts and responses are played back via a server-side Google Translate TTS proxy that sidesteps browser CORS limits.
- **Email OTP authentication** — passwordless login using one-time codes delivered by email through Resend.
- **Rule-based + optional AI validation** — submitted forms are checked with deterministic rules and can be escalated to a deeper Gemini-powered review.
- **QR-coded submissions & status tracking** — each application gets a QR code and moves through a status workflow (`submitted → under_review → processing → completed → ready_for_collection → collected`/`rejected`).
- **Admin & master-admin dashboards** — per-service admin accounts review submissions, edit details, change status, and add notes; a master admin oversees all services. Includes an analytics dashboard.
- **Polished UX** — splash screen, animated transitions (Framer Motion), light/dark theming, and an accessible component library built on Radix UI + Tailwind CSS.

## Tech Stack

| Layer            | Technology                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                                           |
| UI runtime       | React 19                                                          |
| Language         | TypeScript 5                                                      |
| Styling          | Tailwind CSS 4, `tailwindcss-animate`, `tw-animate-css`           |
| UI components    | Radix UI primitives, `lucide-react`, `sonner`, `vaul`, `cmdk`     |
| Animation        | Framer Motion                                                     |
| Forms / schema   | React Hook Form, Zod                                              |
| Speech-to-text   | Groq SDK (Whisper Large v3)                                       |
| LLM / extraction | Groq (Llama 3.3 70B) and Google Generative AI (Gemini 1.5 Flash) |
| Text-to-speech   | Google Translate TTS (server-side proxy)                          |
| Email            | Resend                                                            |
| QR codes         | `qrcode.react`, `jsqr`                                            |
| Charts           | Recharts                                                          |
| Analytics        | Vercel Analytics                                                  |
| Persistence      | JSON file-backed store (`data/submissions.json`)                  |

## Architecture / How It Works

Vaani AI is a single Next.js application. The browser handles audio capture and playback, while Next.js **Route Handlers** under `app/api/*` act as the backend, calling out to the AI and email providers.

A typical voice-application flow:

```text
User selects language and government service (browser)
        │
        ▼
Audio recorded per field  ──►  /api/speech-to-text (Groq Whisper) ──► transcript
        │
        ▼
/api/voice-process
   • Gemini normalizes formatted fields (dates, email, phone, IDs)
   • Rule-based validation + per-language confirmation prompt
        │
        ▼
User confirms each value  ──►  /api/validate (rules + optional Gemini review)
        │
        ▼
/api/submissions/create  ──► submission stored + QR code generated
        │
        ▼
Status workflow tracked; service admins review via dashboard
```

Supporting capabilities:

- **Auth:** `/api/send-otp` emails a one-time code via Resend; the verified email is persisted in the browser to restore sessions.
- **Chatbot:** `/api/chat` streams government-service answers from Groq's Llama model, enforcing the user's language.
- **TTS:** `/api/tts-proxy` fetches synthesized speech from Google Translate and returns the audio to the client.
- **Storage:** submissions live in an in-memory `Map` persisted to `data/submissions.json` (see `lib/submission-db.ts`). Note this is a development/demo store, not a production database.

## Project Structure

```text
Vaani-AI/
├── app/
│   ├── api/                  # Route handlers (backend)
│   │   ├── chat/             # Groq Llama government-services chatbot
│   │   ├── speech-to-text/   # Groq Whisper transcription
│   │   ├── voice-process/    # Gemini normalization + validation per field
│   │   ├── validate/         # Rule-based + optional AI form validation
│   │   ├── tts-proxy/        # Google Translate TTS proxy
│   │   ├── send-otp/         # Resend email OTP
│   │   ├── submissions/      # Create / list / per-user submission APIs
│   │   ├── submission/[id]/  # Single submission API
│   │   ├── analytics/, messages/, notifications/, validate-file/, local-ip/
│   ├── admin/                # Admin dashboard page
│   ├── submission/[id]/      # Submission detail page
│   ├── tts-test/, voice-diagnostic/   # Diagnostic pages
│   ├── layout.tsx            # Root layout, fonts, LanguageProvider
│   └── page.tsx              # Client view router (landing/auth/portal/profile)
├── components/               # Feature components + ui/ (Radix-based library)
├── contexts/                 # LanguageContext (language selection state)
├── hooks/                    # use-mobile, use-toast
├── lib/                      # Services catalog, admin auth, stores, utilities
│   ├── government-services.ts   # 55+ service definitions & fields
│   ├── admin-auth.ts            # Per-service admin credentials
│   ├── submission-db.ts         # File-backed submission store
│   ├── groq-transcription.ts, voice-utils.ts, audio-recorder.ts
│   ├── translations.ts, field-translations.ts, indian-locations.ts
│   └── smart-validation.ts, qr-utils.ts, notification-store.ts, ...
├── public/                   # Logos, icons, images
├── styles/                   # Global styles
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Prerequisites

- **Node.js 18+**
- A package manager: **npm**, **pnpm**, or **yarn**
- API keys for the external services used (see Configuration)

## Installation

```bash
git clone https://github.com/KarthikRommula/Vaani-AI.git
cd Vaani-AI
npm install
```

## Configuration

Create a `.env.local` file in the project root. The following environment variables are read by the code:

| Variable               | Required | Description                                                                 |
| ---------------------- | -------- | --------------------------------------------------------------------------- |
| `GROQ_API_KEY`         | Yes      | Groq API key — powers Whisper speech-to-text and the Llama chatbot.         |
| `GEMINI_API_KEY`       | Yes      | Google Generative AI (Gemini) key — value normalization and AI validation.  |
| `RESEND_API_KEY`       | Yes\*    | Resend API key for sending email OTPs. If unset, OTP email is disabled.     |
| `FROM_EMAIL`           | No       | Sender address for OTP emails (defaults to `onboarding@resend.dev`).        |
| `NEXT_PUBLIC_BASE_URL` | No       | Public base URL used when building links/QR references.                     |
| `NEXT_PUBLIC_ADMIN_KEY`| No       | Client-side admin key used by the admin UI.                                 |
| `ADMIN_SECRET_KEY`     | No       | Server-side admin secret for protected admin operations.                    |
| `SUBMISSION_DB_FILE`   | No       | Override path for the submissions JSON store (defaults to `data/submissions.json`). |

\* Without `RESEND_API_KEY`, the app runs but the OTP email endpoint returns a "not configured" response.

```env
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev
```

## Usage / Running Locally

Start the development server:

```bash
npm run dev
```

The app is available at:

```text
http://localhost:3000
```

From the landing page, choose a language, sign in with an email OTP, pick a government service from the portal, and complete the application by voice.

### Admin access

Per-service admin credentials are defined in `lib/admin-auth.ts` (a master admin account plus one account per service). These are intended for demo/development use — replace them with a real authentication mechanism before any production deployment.

## Available Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the Next.js development server |
| `npm run build` | Create a production build            |
| `npm start`     | Run the production build             |
| `npm run lint`  | Run ESLint                           |

## Production Build

```bash
npm run build
npm start
```

## Security Notes

- The bundled admin credentials in `lib/admin-auth.ts` and the file-based submission store are suitable for demos and local development only. For production, integrate a proper database and a secure authentication/authorization system.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`; type errors will not fail the build, so run type checks separately if needed.

## Contributing

Contributions, suggestions, and feedback are welcome. Please open an issue or submit a pull request for proposed changes.
