import { Suspense, lazy, Component } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

const Loading = () => (
  <div>Loading...</div>
  );
  
const LazyWrapper = (Component) => (props) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
)

const Timeline = LazyWrapper(lazy(() => import("./pages/Timeline")));
const Home = LazyWrapper(lazy(() => import("./pages/Timeline/Home")));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Timeline />}>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div>Not found!</div>} />
        </Route>
      </Routes>
    </Router>
  )
}
