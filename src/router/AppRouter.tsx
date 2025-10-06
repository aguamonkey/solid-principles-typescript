import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import PrinciplePage from '../pages/PrinciplePage';
import InteractivePlayground from '../pages/InteractivePlayground';

const principles = [
  'single-responsibility',
  'open-closed',
  'liskov-substitution',
  'interface-segregation',
  'dependency-inversion'
];

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {principles.map((principle, index) => (
            <Route
              key={principle}
              path={`/principle/${index + 1}-${principle}`}
              element={<PrinciplePage principleId={index + 1} principleName={principle} />}
            />
          ))}
          <Route path="/playground" element={<InteractivePlayground />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
