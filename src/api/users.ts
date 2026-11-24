import { request } from "./client";
import type { ListParams, User, UserInput, UsersResponse } from "../types";

// Local (fake) users ki id bohat badi hoti hai, unpe server call nahi hogi
export const LOCAL_ID_START = 100000;
export const isLocalId = (id: number) => id >= LOCAL_ID_START;

// GET list (search / filter / sort / pagination)
export function fetchUsers(params: ListParams, signal?: AbortSignal) {
  const { search, gender, sortBy, order, page, limit } = params;

  const query = new URLSearchParams({
    limit: String(limit),
    skip: String((page - 1) * limit),
    sortBy,
    order,
  });

  let path = "/users";
  if (search.trim()) {
    path = "/users/search";
    query.set("q", search.trim());
  } else if (gender) {
    path = "/users/filter";
    query.set("key", "gender");
    query.set("value", gender);
  }

  return request<UsersResponse>(`${path}?${query}`, { signal });
}

// GET single
export function fetchUser(id: number, signal?: AbortSignal) {
  return request<User>(`/users/${id}`, { signal });
}

// POST
export function createUser(data: UserInput) {
  return request<User>("/users/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT (poora update)
export function updateUser(id: number, data: UserInput) {
  return request<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// PATCH (sirf kuch fields)
export function patchUser(id: number, data: Partial<UserInput>) {
  return request<User>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// DELETE
export function deleteUser(id: number) {
  return request<User>(`/users/${id}`, { method: "DELETE" });
}