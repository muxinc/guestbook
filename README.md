This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Adding a new event

1.) Visit [Supabase](https://supabase.com) and add a new event row to the `events` table

2.) Update `contants/event.ts` to reflect the new event ID and add sharing details to the dict in that file

3.) Visit the [Vercel project](https://vercel.com) and update the `NEXT_PUBLIC_EVENT_ID` env variable to reflect the new event ID

4.) Add an event logo to `public/images`

5.) Update the watermark URL in `pages/api/upload.ts` to use the new event logo

6. Add a new event page to `pages/[event-name].ts`. You can use this to capture leads who wanted an immediate signup instead of signing the guestbook.

7.) Merge to `main` to trigger a new deploy. Have fun!