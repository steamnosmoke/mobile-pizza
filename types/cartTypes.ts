export type TCartItem = {
  id: string;
  name: string;
  type: number;
  size: number;
  price: number;
  imageUrl: string;
  count?: number;
};

export type TOrder = {
  id: string;
  items: TCartItem[];
  totalPrice: number;
  date: string;
  totalCount: number;
};

export interface TCartSliceState {
  items: TCartItem[];
  totalPrice: number;
  status: "idle" | "loading" | "success" | "error";
}