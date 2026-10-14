import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { lessons, lessonContent } from "../lessons";

const sections = [
  "Guide",
  "Before",
  "Refactored",
  "Demo",
  "Extension Lab",
  "Exercise",
  "Solution",
] as const;
type Section = (typeof sections)[number];
export default function PrinciplePage({
  principleId,
}: {
  principleId: number;
}) {
  const lesson = lessons.find((item) => item.id === principleId);
  const [section, setSection] = useState<Section>("Guide");
  if (!lesson) return <p>Lesson not found.</p>;
  const content = lessonContent(lesson);
  const Demo = lesson.demo;
  const Lab = lesson.lab;
  const folder = `${lesson.id}-${lesson.slug}`;
  const markdown = (text: string, exercise = false) => (
    <div className="study-copy">
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a
              href={
                href?.startsWith("http")
                  ? href
                  : new URL(
                      href ?? "",
                      `https://github.com/aguamonkey/solid-principles-typescript/blob/main/src/principles/${folder}/${exercise ? "exercise/" : ""}README.md`,
                    ).href
              }
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
  return (
    <article className="lesson" data-lesson={lesson.id}>
      <header className="lesson-heading">
        <p className="eyebrow">
          0{lesson.id} / {lesson.setting}
        </p>
        <h1>{lesson.title}</h1>
        <p>{lesson.question}</p>
      </header>
      <nav className="lesson-sections" aria-label="Lesson sections">
        {sections
          .filter(
            (item) =>
              (item !== "Solution" || content.solution) &&
              (item !== "Extension Lab" || Lab),
          )
          .map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={section === item}
              onClick={() => setSection(item)}
            >
              {item}
            </button>
          ))}
      </nav>
      {section === "Guide" && markdown(content.guide)}
      {(section === "Before" || section === "Refactored") && (
        <div>
          <p className="scope-note">
            Actual checked-in source. Supporting files are listed in the guide.
          </p>
          <pre
            className="source-code"
            tabIndex={0}
            aria-label={`${section} source`}
          >
            <code>{section === "Before" ? content.before : content.after}</code>
          </pre>
        </div>
      )}
      {section === "Demo" && (
        <div className="demo-frame">
          <Demo />
        </div>
      )}
      {section === "Extension Lab" && Lab && (
        <div className="demo-frame">
          <Lab />
        </div>
      )}
      {section === "Exercise" && markdown(content.exercise, true)}
      {section === "Solution" && content.solution && markdown(content.solution)}
    </article>
  );
}
