export type Pizza = {
  id: string;
  name: string;
  price: number[][];
  imageUrl: string;
  sizes: number[];
  types: number[];
  category: number;
  rating: number;
};

export type PizzaStatus = "loading" | "success" | "error";

export type PizzaSliceState = {
  items: Pizza[];
  status: PizzaStatus;
  error: string | null;
};

export type FetchPizzasParams = {
  queryString?: string;
};

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