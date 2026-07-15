import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container content-page not-found">
      <span className="kicker">404 · Page not found</span>
      <h1>This sequence has no matching route.</h1>
      <p>The page may have moved, or the address may be incomplete.</p>
      <div className="actions">
        <Link className="button primary" to="/">Return home</Link>
        <Link className="button ghost" to="/lab">Open DNA Lab</Link>
      </div>
    </div>
  );
}
