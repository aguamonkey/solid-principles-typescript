import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { lessons, lessonPath } from "../lessons";
import plan from "../../docs/INTERVIEW_PREP.md?raw";
export default function StudyPlanPage() {
  return (
    <article className="study-copy" aria-label="Interview study plan">
      <p className="eyebrow">STUDY / READ · RUN · EXPLAIN</p>
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
            const lesson = lessons.find(
              (item) =>
                href === `../src/principles/${item.id}-${item.slug}/README.md`,
            );
            return lesson ? (
              <Link to={lessonPath(lesson)}>{children}</Link>
            ) : (
              <a
                href={
                  href
                    ? new URL(
                        href,
                        "https://github.com/aguamonkey/solid-principles-typescript/blob/main/docs/INTERVIEW_PREP.md",
                      ).href
                    : undefined
                }
              >
                {children}
              </a>
            );
          },
        }}
      >
        {plan}
      </ReactMarkdown>
    </article>
  );
}
