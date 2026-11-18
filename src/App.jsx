// Lumen Bath quiz funnel. One screen at a time:
// intro -> three questions -> email (optional) -> result with the matched product.
// Answers are kept in sessionStorage, so a refresh or a cancelled checkout returns to the result.
import { useEffect, useState } from "react";
import { QUESTIONS, isCompleteAnswers } from "./data/quiz.js";
import Intro from "./components/Intro.jsx";
import Question from "./components/Question.jsx";
import EmailGate from "./components/EmailGate.jsx";
import Result from "./components/Result.jsx";

const KEY = "lumen-quiz";

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (saved && isCompleteAnswers(saved.answers)) return { step: "result", answers: saved.answers };
  } catch {
    // ignore
  }
  return { step: "intro", answers: {} };
}

export default function App() {
  const [{ step, answers }, setState] = useState(load);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (step === "result") {
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ answers }));
      } catch {
        // private mode
      }
    }
  }, [step, answers]);

  const go = (next) => setState((s) => ({ ...s, step: next }));

  const answer = (qIndex, optionId) => {
    const q = QUESTIONS[qIndex];
    setState((s) => ({
      answers: { ...s.answers, [q.id]: optionId },
      step: qIndex + 1 < QUESTIONS.length ? qIndex + 1 : "email",
    }));
  };

  const restart = () => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setState({ step: 0, answers: {} });
  };

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="/">Lumen Bath</a>
        {typeof step === "number" && <span className="header-step">Question {step + 1} of {QUESTIONS.length}</span>}
        {step === "result" && (
          <button type="button" className="link" onClick={restart}>Retake the quiz</button>
        )}
      </header>

      <main className="screen" key={String(step)}>
        {step === "intro" && <Intro onStart={() => go(0)} />}
        {typeof step === "number" && (
          <Question index={step} value={answers[QUESTIONS[step].id]} onAnswer={(id) => answer(step, id)} onBack={() => go(step === 0 ? "intro" : step - 1)} />
        )}
        {step === "email" && <EmailGate answers={answers} onDone={() => go("result")} onBack={() => go(QUESTIONS.length - 1)} />}
        {step === "result" && <Result answers={answers} onRestart={restart} />}
      </main>

      <footer className="footer">
        Lumen Bath is a fictional brand made for a portfolio by Celine Sitina. Photos from Unsplash by Peter Muniz, Sincerely Media,
        Andrzej Gdula and Ibnu Ihza.
      </footer>
    </div>
  );
}
