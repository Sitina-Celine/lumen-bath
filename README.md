# Lumen Bath: a body wash quiz funnel

**Find the body wash made for your skin.**

A quiz funnel. Three quick questions match the visitor to one of two body washes, explain why in their own words, and sell the match at a quiz price through Stripe Checkout. An optional email step captures leads without blocking anyone.

Lumen Bath is a fictional brand created for a portfolio demo. Author: Celine Sitina.

## The funnel

```
Ad or social post
  -> Intro            "Find the body wash made for your skin." Start the quiz
  -> 3 questions      skin feel, shower time, scent (one tap each, one screen each)
  -> Email (optional) "Where should we send your skin routine?" with Skip
  -> Result           matched product, fit score, three reasons, $27 (usually $32)
                      order bump: refill pouch $18 (usually $24)
  -> Stripe Checkout  free US shipping
  -> Thank-you page   order read back from Stripe
```

## How the match works

| Answer | Points to |
|---|---|
| Skin feels tight, dry or easily irritated | Oat and Honey Cream Wash |
| Skin is oily or comfortable | Citrus and Vetiver Gel Wash |
| Warm scent, showers at night | add to Oat and Honey's fit |
| Fresh scent, showers in the morning or after workouts | add to Citrus and Vetiver's fit |

Skin decides the product; time and scent raise or lower the fit score (70 to 96%). The three reasons on the result are written from the visitor's own answers, so the result feels personal. All of this lives in `src/data/quiz.js` and is easy to tune.

The visitor can switch to the other wash on the result screen. The checkout records both the product bought and the quiz's own match (`quizMatch` in Stripe metadata), so you can see how often people override the quiz and adjust the rules.

## Design decisions

- **Every step is one screen.** No long page to scroll. Answers move straight to the next question.
- **The email step never blocks.** "Skip, just show me" is always there. Forced emails lose buyers; an optional one still collects leads from interested people.
- **Personal reasons build trust.** "Your skin gets irritated easily. Oat calms it..." reads better than a generic product description.
- **One small order bump.** A refill pouch fits the product and raises the average order from $27 to $45.
- **Nothing is lost.** Answers are kept in the browser session, so a refresh or a cancelled checkout returns straight to the result.
- **No database.** Quiz emails go to `/api/lead` with the answers and the match. Set `LEADS_WEBHOOK_URL` to forward them to Klaviyo, Mailchimp, Zapier or Make, so follow-up emails can use the match.
- **Server-side truth.** Prices live in `src/data/quiz.js` and are read again on the server before charging.

## Tech stack

| Part | Choice |
|---|---|
| Interface | React 19 and Vite, two pages (`index.html`, `thank-you.html`) |
| Payments | Stripe Checkout (prices built on the server with `price_data`) |
| Server code | Vercel serverless functions in `/api` |
| Hosting | Vercel |

## Project structure

```
api/
  create-checkout.js   checks the product, adds the refill, creates the Stripe session
  lead.js              accepts quiz emails, forwards them if LEADS_WEBHOOK_URL is set
  order.js             reads the paid order for the thank-you page
  health.js            shows whether the keys are loaded (never shows them)
src/
  data/quiz.js         questions, products, prices, match rules, fit score, reasons
  data/brand.js        text for the thank-you page
  components/          Intro, Question, EmailGate, Result
  pages/ThankYou.jsx
  styles/              base.css, page.css, thank-you.css
public/img/            photos from Unsplash
```

## Run it locally

1. Install Node.js 20 or newer.
2. `npm install`
3. Copy `.env.example` to `.env.local` and add your Stripe **test** secret key.
4. `npm run dev` and open http://localhost:5173
5. Pay with the Stripe test card `4242 4242 4242 4242`, any future date, any CVC.

## Deploy to Vercel

1. Push the project to GitHub (`.env.local` is ignored by git).
2. Import the repository in Vercel. Framework preset: Vite.
3. Add `STRIPE_SECRET_KEY` (and `LEADS_WEBHOOK_URL` if you use one) under Settings, Environment Variables, then deploy.

## Credits

Photos from Unsplash: Peter Muniz, Sincerely Media, Andrzej Gdula, Ibnu Ihza.
