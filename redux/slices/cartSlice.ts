import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../server/api";
import { Address } from "../../types/authTypes";
import { RootState } from "../store";

export type TCartItem = {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  size: number;
  type: number;
  count: number;
};

export type TOrder = {
  id: string;
  userId: string;
  items: TCartItem[];
  address: Address;
  total: number;
  status?: string;
  createdAt?: string;
};

type CartState = {
  items: TCartItem[];
  status: "idle" | "loading" | "error";
  saveStatus: "idle" | "saving" | "error";
  errorMessage?: string | null;
};

const initialState: CartState = {
  items: [],
  status: "idle",
  saveStatus: "idle",
  errorMessage: null,
};

const findItemIndex = (items: TCartItem[], payload: Partial<TCartItem>) =>
  items.findIndex(
    (it) =>
      it.id === payload.id &&
      it.size === payload.size &&
      it.type === payload.type
  );

const fetchUserCart = createAsyncThunk<
  TCartItem[],
  string,
  { rejectValue: string }
>("cart/fetchUserCart", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/users/${userId}`);
    return (data?.cart || []) as TCartItem[];
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch cart");
  }
});

const saveUserCart = createAsyncThunk<
  TCartItem[],
  { userId: string; items: TCartItem[] },
  { rejectValue: string }
>("cart/saveUserCart", async ({ userId, items }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/users/${userId}`, { cart: items });
    return (data?.cart || []) as TCartItem[];
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to save cart");
  }
});

const createOrder = createAsyncThunk<
  TOrder,
  { userId: string; items: TCartItem[]; address: Address; total: number },
  { rejectValue: string }
>("cart/createOrder", async ({ userId, items, address, total }, thunkAPI) => {
  try {
    const createdAt = new Date().toISOString();
    const newOrder: TOrder = {
      id: String(Date.now()), // простая генерация id; можно заменить на uuid
      userId,
      items,
      address,
      total,
      status: "new",
      createdAt,
    };

    // Получаем текущего пользователя (чтобы взять существующие orders)
    let userData: any = null;
    try {
      const getUserRes = await api.get(`/users/${userId}`);
      userData = getUserRes.data;
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || "Failed to get user";
      return thunkAPI.rejectWithValue(String(msg));
    }

    const existingOrders = Array.isArray(userData?.orders)
      ? userData.orders
      : [];

    // Патчим пользователя: обновляем cart и orders (вставляем объект нового заказа)
    const patchPayload = {
      cart: [],
      orders: [...existingOrders, newOrder],
    };

    let updatedUser: any = null;
    try {
      const patchRes = await api.patch(`/users/${userId}`, patchPayload);
      updatedUser = patchRes.data;
    } catch (err: any) {
      const resp = err?.response?.data;
      const msg =
        (resp && (resp.message || JSON.stringify(resp))) ||
        err?.message ||
        "Failed to update user with order";
      return thunkAPI.rejectWithValue(String(msg));
    }

    try {
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (e) {
      // не фейлим оформление заказа из-за ошибки локального сохранения
      console.warn("AsyncStorage setItem failed:", e);
    }

    // Обновляем auth state
    thunkAPI.dispatch({ type: "auth/login", payload: updatedUser });

    // Очищаем корзину в store
    thunkAPI.dispatch({ type: "cart/clearCart" });

    return newOrder;
  } catch (err: any) {
    const resp = err?.response?.data;
    const msg =
      (resp && (resp.message || JSON.stringify(resp))) ||
      err?.message ||
      "Failed to create order";
    return thunkAPI.rejectWithValue(String(msg));
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<TCartItem>) {
      const payload = action.payload;
      const idx = findItemIndex(state.items, payload);
      if (idx !== -1) {
        state.items[idx].count += payload.count ?? 1;
      } else {
        state.items.push({ ...payload, count: payload.count ?? 1 });
      }
    },
    minusItem(
      state,
      action: PayloadAction<Pick<TCartItem, "id" | "size" | "type">>
    ) {
      const idx = findItemIndex(state.items, action.payload);
      if (idx !== -1) {
        if (state.items[idx].count > 1) {
          state.items[idx].count--;
        } else {
          state.items.splice(idx, 1);
        }
      }
    },
    removeItem(
      state,
      action: PayloadAction<Pick<TCartItem, "id" | "size" | "type">>
    ) {
      state.items = state.items.filter(
        (obj) =>
          !(
            obj.id === action.payload.id &&
            obj.size === action.payload.size &&
            obj.type === action.payload.type
          )
      );
    },
    clearCart(state) {
      state.items = [];
    },
    setCart(state, action: PayloadAction<TCartItem[]>) {
      state.items = action.payload.map((it) => ({
        ...it,
        count: it.count ?? 1,
        price: it.price ?? 0,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCart.pending, (state) => {
        state.status = "loading";
        state.errorMessage = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.items = action.payload.map((it) => ({
          ...it,
          count: it.count ?? 1,
          price: it.price ?? 0,
        }));
        state.status = "idle";
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.status = "error";
        state.errorMessage = action.payload ?? "Failed to fetch cart";
      })
      .addCase(saveUserCart.pending, (state) => {
        state.saveStatus = "saving";
        state.errorMessage = null;
      })
      .addCase(saveUserCart.fulfilled, (state, action) => {
        state.items = action.payload.map((it) => ({
          ...it,
          count: it.count ?? 1,
          price: it.price ?? 0,
        }));
        state.saveStatus = "idle";
      })
      .addCase(saveUserCart.rejected, (state, action) => {
        state.saveStatus = "error";
        state.errorMessage = action.payload ?? "Failed to save cart";
      })
      .addCase(createOrder.pending, (state) => {
        state.saveStatus = "saving";
        state.errorMessage = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.saveStatus = "idle";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.saveStatus = "error";
        state.errorMessage = action.payload ?? "Failed to create order";
      });
  },
});

export const { addItem, minusItem, removeItem, clearCart, setCart } =
  cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, it) => sum + it.price * it.count, 0);
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((sum, it) => sum + it.count, 0);

export { createOrder, fetchUserCart, saveUserCart };

export default cartSlice.reducer;
