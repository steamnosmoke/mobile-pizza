import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../server/api";
import { Address, User } from "../../types/authTypes";
import { RootState } from "../store";

interface AuthState {
  user: User | null;
  isAuth: boolean;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.get<User[]>("/users", {
      params: { email, password },
    });
    const users = res.data;
    if (!users || users.length === 0) {
      return rejectWithValue("Неверный email или пароль");
    }
    const user = users[0];
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message || "Ошибка при входе");
  }
});

export const registerUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const defaultAddress: Address = {
      street: "",
      house: "",
      apartment: "",
      entrance: "",
      floor: "",
      intercom: "",
    };

    const payload = {
      name,
      email,
      password,
      address: defaultAddress,
    };

    const { data } = await api.post<User>("/users", payload);
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Ошибка при регистрации"
    );
  }
});

export const updateUserAddress = createAsyncThunk<
  User,
  { userId: string; address: Address },
  { rejectValue: string }
>("auth/updateAddress", async ({ userId, address }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<User>(`/users/${userId}`, { address });
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Ошибка при обновлении адреса"
    );
  }
});

export const saveUserProfile = createAsyncThunk<
  User,
  { userId: string; name: string; email: string },
  { rejectValue: string }
>("auth/saveProfile", async ({ userId, name, email }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<User>(`/users/${userId}`, { name, email });
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Ошибка при сохранении профиля"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuth = true;
      state.status = "success";
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isAuth = false;
      state.status = "idle";
      state.error = null;
      AsyncStorage.removeItem("user");
    },
    clearError(state) {
      state.error = null;
    },
    updateAddress(state, action: PayloadAction<Address>) {
      if (state.user) {
        state.user.address = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.status = "success";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Произошла ошибка при входе";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuth = true;
        state.status = "success";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Произошла ошибка при регистрации";
      })
      .addCase(updateUserAddress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "success";
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Ошибка при обновлении адреса";
      })
      .addCase(saveUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "success";
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Ошибка при сохранении профиля";
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
