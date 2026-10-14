import { useState } from "react";
import { Link } from "react-router-dom";
import { lessons, lessonPath } from "../lessons";
const prompts = [
  {
    question:
      "The email validation rule changes. Which owner should change first?",
    options: ["Profile display", "userValidator", "Source adapter"],
    correct: 1,
    explanation:
      "Validation owns the contact-form policy. Loading and layout should remain stable.",
  },
  {
    question:
      "Add another notification channel. Which place is expected to change?",
    options: [
      "The dispatch lookup",
      "Every existing sender",
      "Composition and a new strategy",
    ],
    correct: 2,
    explanation:
      "Registration is the chosen extension boundary. Unknown-type policy can still require changing dispatch.",
  },
  {
    question:
      "An implementation matches an interface. What else must you verify?",
    options: ["Its behavioural promises", "Its class name", "Its file size"],
    correct: 0,
    explanation:
      "Matching signatures does not prove substitution. Test the caller’s assumptions and allowed failures.",
  },
  {
    question:
      "A charging consumer receives a worker. What should its parameter require?",
    options: [
      "Every worker capability",
      "Chargeable",
      "A particular robot class",
    ],
    correct: 1,
    explanation:
      "The consumer needs the charging capability, independent of the complete implementation.",
  },
  {
    question: "A selector says SMS. What proves the service actually changed?",
    options: [
      "The selected label",
      "The concrete class name",
      "An injected spy records the SMS call",
    ],
    correct: 2,
    explanation:
      "Verify the dependency’s observed behaviour; a changed status label is insufficient.",
  },
];
export default function InteractivePlayground() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const prompt = prompts[index];
  const lesson = lessons[index];
  return (
    <section>
      <p className="eyebrow">PRACTICE BENCH / RECALL BEFORE READING</p>
      <h1>Make the call.</h1>
      <p className="introduction">
        Choose an owner, explain your reasoning, then attempt the exercise in
        your local editor.
      </p>
      <label htmlFor="practice-principle">Principle</label>
      <select
        id="practice-principle"
        value={index}
        onChange={(event) => {
          setIndex(Number(event.target.value));
          setAnswer(null);
        }}
      >
        {lessons.map((item, i) => (
          <option key={item.id} value={i}>
            {item.title}
          </option>
        ))}
      </select>
      <div className="practice-question">
        <h2>{prompt.question}</h2>
        {prompt.options.map((option, i) => (
          <button
            key={option}
            aria-pressed={answer === i}
            onClick={() => setAnswer(i)}
          >
            {option}
          </button>
        ))}
      </div>
      {answer !== null && (
        <div role="status" className="notice">
          <strong>
            {answer === prompt.correct
              ? "That fits this constraint."
              : "Revisit the consumer’s requirement."}
          </strong>
          <p>{prompt.explanation}</p>
        </div>
      )}
      <Link className="text-link" to={lessonPath(lesson)}>
        Open the lesson and exercise ↗
      </Link>
      <p className="scope-note">
        Guided questions run locally. This page does not compile or execute
        arbitrary TypeScript. Implement exercises in your editor and verify them
        with the repository’s checks.
      </p>
    </section>
  );
}
