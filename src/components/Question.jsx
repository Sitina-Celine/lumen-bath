// One quiz question. Choosing an answer moves straight to the next step.
import { QUESTIONS } from "../data/quiz.js";

export default function Question({ index, value, onAnswer, onBack }) {
  const q = QUESTIONS[index];
  const progress = ((index + 1) / (QUESTIONS.length + 1)) * 100;

  return (
    <section className="quiz" aria-labelledby={`q-${q.id}`}>
      <div className="quiz-main">
        <div className="progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
        <button type="button" className="back" onClick={onBack}>Back</button>
        <h1 id={`q-${q.id}`} className="title-lg">{q.title}</h1>
        <div className={`options options-${q.options.length}`} role="radiogroup" aria-labelledby={`q-${q.id}`}>
          {q.options.map((o) => (
            <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className={`option${value === o.id ? " is-on" : ""}`} onClick={() => onAnswer(o.id)}>
              <span className="option-label">{o.label}</span>
              <span className="option-hint">{o.hint}</span>
            </button>
          ))}
        </div>
      </div>
      <figure className="quiz-media" aria-hidden="true">
        <img src="/img/texture.jpg" alt="" />
      </figure>
    </section>
  );
}
