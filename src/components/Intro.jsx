export default function Intro({ onStart }) {
  return (
    <section className="intro" aria-labelledby="intro-title">
      <div className="intro-copy">
        <p className="eyebrow">The body wash quiz</p>
        <h1 id="intro-title" className="title-xl">
          Find the body wash made for <em>your</em> skin.
        </h1>
        <p className="lead">Three quick questions, about thirty seconds. We match you to the wash your skin actually needs.</p>
        <button type="button" className="btn" onClick={onStart}>Start the quiz</button>
        <p className="intro-offer">Your match comes with 15% off.</p>
        <ul className="points">
          <li>Sulfate-free formulas</li>
          <li>Free US shipping</li>
          <li>30-day happy-skin promise</li>
        </ul>
      </div>
      <figure className="intro-media">
        <img src="/img/hero.jpg" alt="An amber pump bottle beside a black tap, with a white waffle towel on the rail" fetchPriority="high" />
      </figure>
    </section>
  );
}
