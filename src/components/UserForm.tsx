import { useState } from "react";
import type { User, UserInput } from "../types";

interface Props {
  initial: User | null; // null = Add mode, object = Edit mode
  saving: boolean;
  onSubmit: (data: UserInput) => void;
  onCancel: () => void;
}

export default function UserForm({ initial, saving, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<UserInput>({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    age: initial?.age ?? 18,
    gender: initial?.gender ?? "male",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim())
      return setError("First name aur last name zaroori hain");
    if (!form.email.includes("@")) return setError("Email sahi nahi hai");
    if (form.age < 1 || form.age > 120)
      return setError("Age 1 se 120 ke darmiyan honi chahiye");
    setError(null);
    onSubmit({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
    });
  }

  return (
    <div className="overlay" onClick={onCancel}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{initial ? "Edit User" : "Add User"}</h2>

        <div className="row">
          <label>
            First name
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </label>
          <label>
            Last name
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </label>
        </div>

        <div className="row">
          <label>
            Age
            <input
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
            />
          </label>
          <label>
            Gender
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label>
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}