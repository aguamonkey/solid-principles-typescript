import { Link } from "react-router-dom";
import { lessons, lessonPath } from "../lessons";
export default function HomePage() {
  return (
    <div className="index-page">
      <p className="eyebrow">
        TYPESCRIPT + REACT / FIELDWORK IN SOFTWARE DESIGN
      </p>
      <h1>
        Decisions,
        <br />
        <em>made visible.</em>
      </h1>
      <p className="introduction">
        Five small settings for studying where change belongs. Follow the
        source, run the demonstration, then make a change yourself.
      </p>
      <p>
        <Link to="/study">Start the interview study plan</Link>
      </p>
      <div className="study-sequence">
        <span>01 / READ THE GUIDE</span>
        <span>02 / RUN THE DEMO</span>
        <span>03 / TRY THE EXERCISE</span>
      </div>
      <div className="lesson-index">
        {lessons.map((lesson) => (
          <Link to={lessonPath(lesson)} key={lesson.id}>
            <span className="folio">0{lesson.id}</span>
            <div>
              <p className="eyebrow">{lesson.setting}</p>
              <h2>{lesson.title}</h2>
              <p>{lesson.question}</p>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      <p className="scope-note">
        Start with Contact desk. These are local teaching fixtures; the before
        examples show a particular change pressure, not universal rules about
        classes or file counts.
      </p>
    </div>
  );
}
