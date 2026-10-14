import { HashRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import PrinciplePage from "../pages/PrinciplePage";
import InteractivePlayground from "../pages/InteractivePlayground";
import { lessons, lessonPath } from "../lessons";
export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {lessons.map((lesson) => (
            <Route
              key={lesson.id}
              path={lessonPath(lesson)}
              element={
                <PrinciplePage key={lesson.id} principleId={lesson.id} />
              }
            />
          ))}
          <Route path="/playground" element={<InteractivePlayground />} />
          <Route
            path="*"
            element={
              <div>
                <h1>Page not found</h1>
                <Link to="/">Return to the index</Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}
