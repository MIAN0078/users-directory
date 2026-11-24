import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createUser, fetchUsers } from "../api/users";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import Toolbar from "../components/Toolbar";
import UserCard from "../components/UserCard";
import UserForm from "../components/UserForm";
import Pagination from "../components/Pagination";
import { EmptyView, ErrorView, LoadingView } from "../components/StatusViews";
import type { SortField, SortOrder, User, UserInput } from "../types";

const PAGE_SIZE = 12;

export default function UsersPage() {
  const [sp, setSp] = useSearchParams();

  // URL se state padho
  const q = sp.get("q") ?? "";
  const gender = sp.get("gender") ?? "";
  const sortBy = (sp.get("sortBy") ?? "firstName") as SortField;
  const order = (sp.get("order") ?? "asc") as SortOrder;
  const page = Number(sp.get("page")) || 1;

  // URL update helper: page ke ilawa kuch bhi badle to page 1 pe wapas
  function updateParams(changes: Record<string, string>) {
    const next = new URLSearchParams(sp);
    Object.entries(changes).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!("page" in changes)) next.set("page", "1");
    setSp(next);
  }

  // Search input: typing fauran dikhe, lekin URL/API 400ms baad update ho
  const [searchInput, setSearchInput] = useState(q);
  const debounced = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debounced !== q) updateParams({ q: debounced });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Data fetch (useCallback zaroori hai)
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      fetchUsers(
        { search: q, gender, sortBy, order, page, limit: PAGE_SIZE },
        signal
      ),
    [q, gender, sortBy, order, page]
  );
  const { data, setData, status, error, retry } = useFetch(fetcher);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function clearFilters() {
    setSearchInput("");
    setSp({});
  }

  // CREATE (POST)
  async function handleCreate(input: UserInput) {
    setSaving(true);
    setActionError(null);
    try {
      await createUser(input); // server simulate karega
      const newUser: User = {
        ...input,
        id: Date.now(), // bohat badi id = local user
        username: input.firstName.toLowerCase(),
        image: "https://placehold.co/64x64?text=New",
        role: "user",
        company: { name: "—", title: "New user", department: "—" },
        address: { city: "—", state: "—", country: "—" },
      };
      setData((prev) =>
        prev
          ? { ...prev, users: [newUser, ...prev.users], total: prev.total + 1 }
          : prev
      );
      setNotice("User add ho gaya (simulated, server pe save nahi hota).");
      setFormOpen(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toolbar
        search={searchInput}
        gender={gender}
        sortBy={sortBy}
        order={order}
        onSearch={setSearchInput}
        onGender={(v) => updateParams({ gender: v })}
        onSort={(field, ord) => updateParams({ sortBy: field, order: ord })}
        onAdd={() => setFormOpen(true)}
      />

      {actionError && (
        <div className="banner error">
          {actionError}
          <button onClick={() => setActionError(null)}>✕</button>
        </div>
      )}
      {notice && (
        <div className="banner info">
          {notice}
          <button onClick={() => setNotice(null)}>✕</button>
        </div>
      )}

      {status === "loading" && <LoadingView />}
      {status === "error" && <ErrorView message={error ?? "Error"} onRetry={retry} />}
      {status === "success" && users.length === 0 && (
        <EmptyView onClear={clearFilters} />
      )}
      {status === "success" && users.length > 0 && (
        <>
          <p className="count">{total} users</p>
          <div className="grid">
            {users.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(p) => updateParams({ page: String(p) })}
          />
        </>
      )}

      {formOpen && (
        <UserForm
          initial={null}
          saving={saving}
          onSubmit={handleCreate}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </>
  );
}