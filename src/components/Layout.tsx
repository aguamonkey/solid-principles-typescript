import { Outlet, NavLink, Link } from "react-router-dom";
import { lessons, lessonPath } from "../lessons";
export default function Layout() {
  return (
    <div className="workbook">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="masthead">
        <Link to="/" className="wordmark">
          SOLID <span>/ a workbook</span>
        </Link>
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Index
          </NavLink>
          <NavLink to="/study">Study plan</NavLink>
          <NavLink to="/playground">Practice bench</NavLink>
          <a href="https://github.com/aguamonkey/solid-principles-typescript">
            GitHub
          </a>
        </nav>
      </header>
      <div className="workbook-grid">
        <aside className="workbook-contents">
          <p className="eyebrow">FIVE DESIGN QUESTIONS</p>
          <nav aria-label="Lessons">
            {lessons.map((lesson) => (
              <NavLink key={lesson.id} to={lessonPath(lesson)}>
                <span className="folio">0{lesson.id}</span>
                <span>
                  {lesson.title}
                  <small>{lesson.setting}</small>
                </span>
              </NavLink>
            ))}
          </nav>
          <p className="scope-note">
            Read. Change. Test.
            <br />
            Explain your decision.
          </p>
        </aside>
        <main id="main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <footer className="page-footer">
        SOLID STUDIES / TYPESCRIPT EDITION{" "}
        <span>FOUNDATION SERIES · 01—05</span>
      </footer>
    </div>
  );
}
