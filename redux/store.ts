import { configureStore } from "@reduxjs/toolkit";
import cart from "./slices/cartSlice";
import auth from "./slices/authSlice";
import pizza from "./slices/pizzaSlice";
import filter from "./slices/filterSlice";

export const store = configureStore({
  reducer: {
    cart,
    auth,
    pizza,
    filter,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
