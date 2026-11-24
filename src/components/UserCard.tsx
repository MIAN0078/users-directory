import { Link } from "react-router-dom";
import { isLocalId } from "../api/users";
import type { User } from "../types";

export default function UserCard({ user }: { user: User }) {
  const content = (
    <>
      <img src={user.image} alt={user.firstName} width={64} height={64} />
      <div className="card-info">
        <h3>
          {user.firstName} {user.lastName}
        </h3>
        <p className="muted">{user.email}</p>
        <p className="muted">
          {user.company.title} · {user.company.name}
        </p>
        <p className="muted">
          {user.address.city}, {user.address.country}
        </p>
      </div>
    </>
  );

  if (isLocalId(user.id)) {
    return (
      <div className="card">
        {content}
        <span className="badge">Local only</span>
      </div>
    );
  }

  return (
    <Link to={`/users/${user.id}`} className="card link">
      {content}
    </Link>
  );
}