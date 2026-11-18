// Brand text used by the shared thank-you page
export const BRAND = {
  name: "Lumen Bath",
  thanksTitle: (first) => (first ? `Thank you, ${first}.` : "Thank you."),
  backLabel: "Back to Lumen Bath",
  nextSteps: () => [
    "We pack your order within one business day.",
    "Free standard shipping takes 3 to 5 business days. You'll get a tracking link by email.",
    "Use a small amount on damp skin. Not happy with how your skin feels in 30 days? We'll refund you.",
  ],
};
