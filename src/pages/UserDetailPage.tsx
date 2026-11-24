import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteUser, fetchUser, patchUser, updateUser } from "../api/users";
import { useFetch } from "../hooks/useFetch";
import UserForm from "../components/UserForm";
import { ErrorView, LoadingView } from "../components/StatusViews";
import type { User, UserInput } from "../types";

// PATCH ke liye chhota sa inline email editor
function QuickEmail({
  user,
  busy,
  onSave,
}: {
  user: User;
  busy: boolean;
  onSave: (email: string) => void;
}) {
  const [email, setEmail] = useState(user.email);
  const changed = email.trim() !== user.email && email.includes("@");

  return (
    <div className="quick">
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn" disabled={!changed || busy} onClick={() => onSave(email.trim())}>
        {busy ? "Saving..." : "Update email (PATCH)"}
      </button>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);

  const fetcher = useCallback(
    (signal: AbortSignal) => fetchUser(userId, signal),
    [userId]
  );
  const { data: user, setData, status, error, retry } = useFetch(fetcher);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (status === "loading") return <LoadingView />;

  if (status === "error" || !user) {
    return (
      <>
        <Link to="/" className="back">← Back to users</Link>
        <ErrorView message={error ?? "User not found"} onRetry={retry} />
      </>
    );
  }

  // PUT
  async function handleEdit(input: UserInput) {
    setSaving(true);
    setActionError(null);
    try {
      await updateUser(userId, input);
      setData((prev) => (prev ? { ...prev, ...input } : prev));
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  // PATCH
  async function handleEmail(email: string) {
    setBusy(true);
    setActionError(null);
    try {
      await patchUser(userId, { email });
      setData((prev) => (prev ? { ...prev, email } : prev));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  // DELETE
  async function handleDelete() {
    if (!user) return;
    if (!window.confirm(`${user.firstName} ${user.lastName} ko delete karna hai?`)) return;
    setBusy(true);
    setActionError(null);
    try {
      await deleteUser(userId);
      navigate("/");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <div>
      <Link to="/" className="back">← Back to users</Link>

      {actionError && (
        <div className="banner error">
          {actionError}
          <button onClick={() => setActionError(null)}>✕</button>
        </div>
      )}

      <div className="detail">
        <img src={user.image} alt={user.firstName} width={120} height={120} />
        <div>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p className="muted">
            @{user.username} · {user.role}
          </p>

          <dl>
            <dt>Age</dt>
            <dd>{user.age}</dd>
            <dt>Gender</dt>
            <dd>{user.gender}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
            <dt>Company</dt>
            <dd>
              {user.company.name} ({user.company.department})
            </dd>
            <dt>Job title</dt>
            <dd>{user.company.title}</dd>
            <dt>Location</dt>
            <dd>
              {user.address.city}, {user.address.state}, {user.address.country}
            </dd>
          </dl>

          <QuickEmail key={user.email} user={user} busy={busy} onSave={handleEmail} />

          <div className="actions left">
            <button className="btn primary" disabled={busy} onClick={() => setFormOpen(true)}>
              Edit (PUT)
            </button>
            <button className="btn danger" disabled={busy} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>

      {formOpen && (
        <UserForm
          initial={user}
          saving={saving}
          onSubmit={handleEdit}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}