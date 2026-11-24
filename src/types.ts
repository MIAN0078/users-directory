export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  company: {
    name: string;
    title: string;
    department: string;
  };
  address: {
    city: string;
    state: string;
    country: string;
  };
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// Form se jo fields aayengi
export type UserInput = Pick<
  User,
  "firstName" | "lastName" | "age" | "gender" | "email" | "phone"
>;

export type SortField = "firstName" | "lastName" | "age";
export type SortOrder = "asc" | "desc";

export interface ListParams {
  search: string;
  gender: string;
  sortBy: SortField;
  order: SortOrder;
  page: number;
  limit: number;
}

export type Status = "loading" | "success" | "error";