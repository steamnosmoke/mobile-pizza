import { TCartItem, TOrder } from "./cartTypes";


export interface User {
  id: string;
  email: string;
  name: string;
  address?: Address;
  orders?: TOrder[];
  cart?: TCartItem[];
}

export interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

export interface Address {
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
}

