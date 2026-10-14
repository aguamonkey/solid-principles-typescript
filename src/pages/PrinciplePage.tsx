import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  lessons,
  lessonContent,
  lessonStudyDocuments,
  localStudyDocument,
  studyDocumentUrl,
} from "../lessons";

const sections = [
  "Guide",
  "Before",
  "Refactored",
  "Demo",
  "Extension Lab",
  "Exercise",
  "Solution",
  "Study notes",
] as const;
type Section = (typeof sections)[number];
export default function PrinciplePage({
  principleId,
}: {
  principleId: number;
}) {
  const lesson = lessons.find((item) => item.id === principleId);
  const [section, setSection] = useState<Section>("Guide");
  const [studyPath, setStudyPath] = useState("");
  if (!lesson) return <p>Lesson not found.</p>;
  const content = lessonContent(lesson);
  const Demo = lesson.demo;
  const Lab = lesson.lab;
  const root = `./principles/${lesson.id}-${lesson.slug}`;
  const notes = lessonStudyDocuments(lesson);
  const selectedNote =
    notes.find((item) => item.path === studyPath) ??
    notes.find((item) => item.label.endsWith("Interview prompts")) ??
    notes[0];
  const markdown = (text: string, path = `${root}/README.md`) => (
    <div className="study-copy">
      <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div
              className="study-table"
              role="region"
              aria-label="Study table"
              tabIndex={0}
            >
              <table>{children}</table>
            </div>
          ),
          a: ({ href, children }) => {
            const target = href
              ? localStudyDocument(lesson, path, href)
              : undefined;
            return (
              <a
                href={
                  href ? new URL(href, studyDocumentUrl(path)).href : undefined
                }
                onClick={
                  target
                    ? (event) => {
                        event.preventDefault();
                        setStudyPath(target.path);
                        setSection("Study notes");
                      }
                    : undefined
                }
              >
                {children}
              </a>
            );
          },
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
              {item === "Extension Lab" ? (lesson.labLabel ?? item) : item}
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
      {section === "Exercise" &&
        markdown(content.exercise, `${root}/exercise/README.md`)}
      {section === "Solution" &&
        content.solution &&
        markdown(content.solution, `${root}/SOLUTION.md`)}
      {section === "Study notes" && (
        <section aria-label="Study documents">
          <p className="scope-note">
            Read prompts before answer notes. Foundation and advanced exercises
            are separate changes to attempt in your editor.
          </p>
          <label htmlFor="study-document">Study document</label>
          <select
            id="study-document"
            value={selectedNote.path}
            onChange={(event) => setStudyPath(event.target.value)}
          >
            {notes.map((note) => (
              <option key={note.path} value={note.path}>
                {note.label}
              </option>
            ))}
          </select>
          {markdown(selectedNote.body, selectedNote.path)}
        </section>
      )}
    </article>
  );
}
