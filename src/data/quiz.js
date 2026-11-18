// Quiz questions, products, prices and the matching rules.
// The page uses this to pick a match; the server reads it again to charge,
// so prices can't be changed in the browser.

export const QUESTIONS = [
  {
    id: "skin",
    title: "How does your skin feel after a shower?",
    options: [
      { id: "dry", label: "Tight or dry", hint: "It wants lotion straight away." },
      { id: "sensitive", label: "Itchy or easily irritated", hint: "Some soaps leave it red." },
      { id: "oily", label: "Oily by midday", hint: "It gets shiny fast." },
      { id: "balanced", label: "Comfortable", hint: "No complaints." },
    ],
  },
  {
    id: "time",
    title: "When do you usually shower?",
    options: [
      { id: "morning", label: "In the morning", hint: "To wake up." },
      { id: "evening", label: "At night", hint: "To wind down." },
      { id: "workout", label: "After a workout", hint: "To feel clean again." },
      { id: "any", label: "It changes", hint: "Whenever the day allows." },
    ],
  },
  {
    id: "scent",
    title: "Which scent do you reach for?",
    options: [
      { id: "warm", label: "Warm and soft", hint: "Honey, oat, vanilla." },
      { id: "fresh", label: "Fresh and green", hint: "Citrus, vetiver, herbs." },
      { id: "light", label: "Barely there", hint: "Clean, not perfumed." },
    ],
  },
];

export const PRODUCTS = {
  oat: {
    id: "oat",
    name: "Oat and Honey Cream Wash",
    short: "Oat and Honey",
    tagline: "A rich cream wash that cleans without stripping.",
    ingredients: ["Colloidal oat", "Raw honey", "Shea butter"],
    size: "300 ml",
    img: "/img/oat.jpg",
    alt: "A white pump bottle standing on soft brown linen",
  },
  citrus: {
    id: "citrus",
    name: "Citrus and Vetiver Gel Wash",
    short: "Citrus and Vetiver",
    tagline: "A clear gel that rinses clean and wakes you up.",
    ingredients: ["Bergamot", "Vetiver root", "Aloe vera"],
    size: "300 ml",
    img: "/img/citrus.jpg",
    alt: "A white pump bottle on a dark tray with green leaves and pale driftwood",
  },
};

// Quiz price: 15% off the usual price
export const PRICE = { now: 27, was: 32 };
export const REFILL = { name: "Refill pouch", price: 18, was: 24, detail: "Same wash, 500 ml, less plastic." };

// Dry or easily irritated skin gets the cream wash; everyone else gets the gel.
export const matchFor = (answers) => (["dry", "sensitive"].includes(answers.skin) ? "oat" : "citrus");

// A simple fit score: how many answers point the same way as the product
export function fitScore(answers, productId) {
  const oat = productId === "oat";
  let score = 86;
  if (answers.skin === "balanced") score += 2;
  else if (["dry", "sensitive"].includes(answers.skin) === oat) score += 4;
  else score -= 6;
  if (answers.scent === "light") score += 2;
  else if ((answers.scent === "warm") === oat) score += 4;
  else score -= 3;
  if (answers.time === "any") score += 1;
  else if ((answers.time === "evening") === oat) score += 2;
  return Math.max(70, Math.min(96, score));
}

// Three plain reasons, written from the visitor's own answers
export function reasonsFor(answers, productId) {
  const oat = productId === "oat";
  const skin = {
    dry: "Your skin feels tight after a shower. Colloidal oat and shea butter put moisture back while you wash.",
    sensitive: "Your skin gets irritated easily. Oat calms it, and there are no harsh sulfates or dyes.",
    oily: "Your skin gets oily by midday. The gel rinses clean and leaves no film behind.",
    balanced: "Your skin is comfortable as it is. A light gel keeps it that way.",
  }[answers.skin];
  const skinText = oat && answers.skin !== "dry" && answers.skin !== "sensitive"
    ? "It is gentle enough for any skin, and leaves a soft, cared-for feel."
    : !oat && (answers.skin === "dry" || answers.skin === "sensitive")
      ? "It is sulfate-free with aloe, so it stays kind to drier skin."
      : skin;

  let timeText;
  if (oat) timeText = answers.time === "evening" ? "You shower at night. Warm honey helps you wind down." : "Its soft scent works at any time of day.";
  else if (answers.time === "morning") timeText = "You shower in the morning. Bergamot and vetiver help you wake up.";
  else if (answers.time === "workout") timeText = "You shower after workouts. The gel cuts through sweat and feels fresh.";
  else timeText = "Its clean, green scent works at any time of day.";

  let scentText;
  if (answers.scent === "light") scentText = "You like a barely-there scent. This one fades softly after you rinse.";
  else if (answers.scent === "warm" && oat) scentText = "You like warm, soft scents, and this one smells of oat and honey.";
  else if (answers.scent === "fresh" && !oat) scentText = "You like fresh scents, and this one smells of citrus and green vetiver.";
  else scentText = `You prefer ${answers.scent === "warm" ? "warm" : "fresh"} scents. We chose this one for your skin first; its scent is light.`;

  return [skinText, timeText, scentText];
}

export const isCompleteAnswers = (a) =>
  a && QUESTIONS.every((q) => q.options.some((o) => o.id === a[q.id]));
