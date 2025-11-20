import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../server/api";
import { Pizza, PizzaSliceState } from "../../types/productTypes";
import { RootState } from "../store";

const initialState: PizzaSliceState = {
  items: [],
  status: "loading",
  error: null,
};

// ==========================
// Нормализация данных пиццы с учетом структуры данных
// ==========================
const normalizePizza = (item: any): Pizza => ({
  id: String(item.id),
  name: String(item.name),
  imageUrl: String(item.imageUrl),
  price: Array.isArray(item.price) ? item.price : [[0]],
  sizes: Array.isArray(item.sizes) ? item.sizes : [26, 30, 40],
  types: Array.isArray(item.types) ? item.types : [0],
  category: Number(item.category) || 0,
  rating:
    typeof item.rating === "string"
      ? parseFloat(item.rating)
      : Number(item.rating) || 0,
});

// ==========================
// AsyncThunk - загружаем ВСЕ пиццы (без параметров)
// ==========================
export const fetchPizzas = createAsyncThunk<
  Pizza[],
  void, // Без параметров
  { rejectValue: string }
>("pizza/fetchPizzasStatus", async (_, { rejectWithValue }) => {
  try {
    // Загружаем все пиццы без фильтров
    const { data } = await api.get<any[]>(`/pizzas`);

    if (!Array.isArray(data)) {
      return rejectWithValue("Invalid data format");
    }

    return data.map(normalizePizza);
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to fetch pizzas";

    return rejectWithValue(message);
  }
});

// ==========================
// Slice
// ==========================
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
        state.status = "error";
        state.items = [];
        state.error = action.payload || "Unknown error";
      });
  },
});

// ==========================
// Селекторы
// ==========================
export const selectPizza = (state: RootState) => state.pizza;
export const selectPizzaItems = (state: RootState) => state.pizza.items;
export const selectPizzaStatus = (state: RootState) => state.pizza.status;
export const selectPizzaError = (state: RootState) => state.pizza.error;

export const selectPizzaById = (id: string) => (state: RootState) =>
  state.pizza.items.find((p) => p.id === id);

export const selectPizzaPrice =
  (id: string, type: number, size: number) => (state: RootState) => {
    const pizza = state.pizza.items.find((p) => p.id === id);
    return pizza?.price?.[type]?.[size] ?? 0;
  };

export const { resetPizzas } = pizzaSlice.actions;
export default pizzaSlice.reducer;
