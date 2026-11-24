import { Link, Route, Routes } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UserDetailPage from "./pages/UserDetailPage";

export default function App() {
  return (
    <div className="container">
      <h1>
        <Link to="/" className="title-link">👥 Users Directory</Link>
      </h1>

      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route
          path="*"
          element={
            <div className="state">
              <p>Page not found.</p>
              <Link to="/" className="btn">Go home</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}