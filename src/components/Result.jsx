// The result: the matched product, why it fits, the quiz price and an optional refill.
import { useEffect, useState } from "react";
import { PRODUCTS, PRICE, REFILL, matchFor, fitScore, reasonsFor } from "../data/quiz.js";

export default function Result({ answers, onRestart }) {
  const match = matchFor(answers);
  const [productId, setProductId] = useState(match);
  const [refill, setRefill] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cancelled] = useState(() => new URLSearchParams(location.search).get("checkout") === "cancelled");

  useEffect(() => {
    const reset = () => setBusy(false);
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const product = PRODUCTS[productId];
  const other = PRODUCTS[productId === "oat" ? "citrus" : "oat"];
  const isMatch = productId === match;
  const fit = fitScore(answers, productId);
  const total = PRICE.now + (refill ? REFILL.price : 0);

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId, refill, answers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout couldn't start. Please try again.");
      location.href = data.url;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <section className={`result result-${productId}`} aria-labelledby="result-title">
      <figure className="result-media">
        <img key={product.id} src={product.img} alt={product.alt} />
        <figcaption className="fit">
          <span className="fit-num">{fit}%</span>
          <span className="fit-label">fit for your skin</span>
        </figcaption>
      </figure>

      <div className="result-copy">
        {cancelled && <p className="notice">Your match is saved. Pick up where you left off.</p>}
        <p className="eyebrow">{isMatch ? "Your match" : "You're viewing"}</p>
        <h1 id="result-title" className="title-lg">{product.name}</h1>
        <p className="lead">{product.tagline}</p>

        <ul className="reasons">
          {reasonsFor(answers, productId).map((r) => <li key={r}>{r}</li>)}
        </ul>

        <ul className="ingredients" aria-label="Key ingredients">
          {product.ingredients.map((i) => <li key={i}>{i}</li>)}
        </ul>

        <div className="buy">
          <div className="price">
            <strong>${PRICE.now}</strong>
            <s>${PRICE.was}</s>
            <span className="price-tag">15% off, quiz price</span>
          </div>

          <label className="bump">
            <input type="checkbox" checked={refill} onChange={(e) => setRefill(e.target.checked)} />
            <span>
              <strong>Add a {REFILL.name.toLowerCase()}, ${REFILL.price}</strong> <s>${REFILL.was}</s>
              <br />
              <span className="bump-detail">{REFILL.detail}</span>
            </span>
          </label>

          <button type="button" className="btn btn-wide" onClick={checkout} disabled={busy}>
            {busy ? "Opening secure checkout..." : `Get my wash, $${total}`}
          </button>
          {error && <p className="error" role="alert">{error}</p>}
          <p className="fine">{product.size}. Free US shipping. 30-day happy-skin promise.</p>
        </div>

        <p className="switch">
          {isMatch ? "Not quite you? " : "Changed your mind? "}
          <button type="button" className="link" onClick={() => setProductId(other.id)}>
            {isMatch ? `See ${other.short} instead` : `Back to your match, ${other.short}`}
          </button>
          <span className="dot-sep" aria-hidden="true" />
          <button type="button" className="link" onClick={onRestart}>Retake the quiz</button>
        </p>
      </div>
    </section>
  );
}
