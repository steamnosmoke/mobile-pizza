export interface Pizza {
  id: string;
  name: string;
  imageUrl: string;
  price: number[][];
  sizes: number[];
  types: number[];
  category: number;
  rating: number;
}

export type PizzaStatus = "loading" | "success" | "error";

export interface PizzaSliceState {
  items: Pizza[];
  status: "loading" | "success" | "error";
  error: string | null;
}


export type TFilterSliceState = {
  categoryId: number;
  sort: {
    name: string;
    sortProperty: string;
  };
  sortOpened: boolean;
  categoryOpened: boolean;
  searchValue: string;
};
