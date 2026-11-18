// Optional email step before the result. Skipping is always allowed.
import { useState } from "react";
import { matchFor } from "../data/quiz.js";

export default function EmailGate({ answers, onDone, onBack }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email, or skip.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "quiz", extra: { ...answers, match: matchFor(answers) } }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. You can skip for now.");
      }
      onDone();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <section className="gate" aria-labelledby="gate-title">
      <div className="progress" aria-hidden="true"><span style={{ width: "100%" }} /></div>
      <button type="button" className="back" onClick={onBack}>Back</button>
      <p className="eyebrow">Your match is ready</p>
      <h1 id="gate-title" className="title-lg">Where should we send your skin routine?</h1>
      <p className="lead">We'll email your match, how to use it, and a reminder of your 15% off. Nothing else.</p>
      <form className="gate-form" onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="gate-email">Email</label>
        <input id="gate-email" type="email" autoComplete="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn" type="submit" disabled={busy}>{busy ? "Saving..." : "Show my match"}</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="button" className="link skip" onClick={onDone}>Skip, just show me</button>
    </section>
  );
}
