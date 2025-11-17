import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../server/api";
import {
  FetchPizzasParams,
  Pizza,
  PizzaSliceState,
} from "../../types/productTypes";
import { RootState } from "../store";

const initialState: PizzaSliceState = {
  items: [],
  status: "loading",
  error: null,
};

export const fetchPizzas = createAsyncThunk<
  Pizza[],
  FetchPizzasParams,
  { rejectValue: string }
>("pizza/fetchPizzasStatus", async (params, { rejectWithValue }) => {
  try {
    const { queryString = "" } = params;
    const { data } = await api.get<Pizza[]>(`/pizzas?${queryString}`);

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    const normalizedData: Pizza[] = data.map((item: any) => ({
      id: String(item.id),
      name: String(item.name),
      imageUrl: String(item.imageUrl),
      price:
        Array.isArray(item.price) && item.price.every(Array.isArray)
          ? item.price
          : [[0], [0]],
      sizes: Array.isArray(item.sizes) ? item.sizes : [26, 30, 40],
      types: Array.isArray(item.types) ? item.types : [0],
      category: Number(item.category) || 0,
      rating: Number(item.rating) || 0,
    }));

    return normalizedData;
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.message || err.message || "Failed to fetch pizzas";
    return rejectWithValue(errorMessage);
  }
});

const pizzaSlice = createSlice({
  name: "pizza",
  initialState,
  reducers: {
    resetPizzas: (state) => {
      state.items = [];
      state.status = "loading";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
        state.error = null;
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        state.items = [];
        state.status = "error";
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const selectPizza = (state: RootState) => state.pizza;
export const selectPizzaItems = (state: RootState) => state.pizza.items;
export const selectPizzaById = (id: string) => (state: RootState) =>
  state.pizza.items.find((item) => item.id === id);
export const selectPizzaStatus = (state: RootState) => state.pizza.status;
export const selectPizzaError = (state: RootState) => state.pizza.error;

export const selectPizzaPrice =
  (id: string, typeIndex: number, sizeIndex: number) => (state: RootState) => {
    const pizza = state.pizza.items.find((item) => item.id === id);
    return pizza?.price?.[typeIndex]?.[sizeIndex] || 0;
  };

export const { resetPizzas } = pizzaSlice.actions;
export default pizzaSlice.reducer;
