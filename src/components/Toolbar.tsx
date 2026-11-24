import type { SortField, SortOrder } from "../types";

interface Props {
  search: string;
  gender: string;
  sortBy: SortField;
  order: SortOrder;
  onSearch: (v: string) => void;
  onGender: (v: string) => void;
  onSort: (field: SortField, order: SortOrder) => void;
  onAdd: () => void;
}

export default function Toolbar(p: Props) {
  return (
    <div className="toolbar">
      <input
        type="search"
        placeholder="Search by name..."
        value={p.search}
        onChange={(e) => p.onSearch(e.target.value)}
      />

      <select
        value={p.gender}
        onChange={(e) => p.onGender(e.target.value)}
        disabled={p.search.trim() !== ""}
        title={p.search ? "Search ke dauran gender filter band hai" : ""}
      >
        <option value="">All genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        value={p.sortBy}
        onChange={(e) => p.onSort(e.target.value as SortField, p.order)}
      >
        <option value="firstName">Sort: First name</option>
        <option value="lastName">Sort: Last name</option>
        <option value="age">Sort: Age</option>
      </select>

      <select
        value={p.order}
        onChange={(e) => p.onSort(p.sortBy, e.target.value as SortOrder)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <button className="btn primary" onClick={p.onAdd}>
        + Add User
      </button>
    </div>
  );
}