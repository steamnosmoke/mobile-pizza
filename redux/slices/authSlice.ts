import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../server/api";
import { Address, User } from "../../types/authTypes";
import { RootState } from "../store";
import CryptoJS from "crypto-js";

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

// ==============================
// ХЭШЕРОВАНИЕ ПАРОЛЯ
// ==============================
function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString();
}

// ==============================
// ЛОГИН
// ==============================
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    // 1. Ищем юзера по email
    const res = await api.get<User[]>("/users", {
      params: { email },
    });

    const user = res.data[0];
    if (!user) return rejectWithValue("Пользователь не найден");

    // 2. Хэшируем введённый пароль
    const inputHash = hashPassword(password);

    // 3. Сравниваем хэши
    if (inputHash !== user.passwordHash) {
      return rejectWithValue("Неверный пароль");
    }

    // 4. Сохраняем юзера локально
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err: any) {
    return rejectWithValue("Ошибка при входе");
  }
});

// ==============================
// РЕГИСТРАЦИЯ
// ==============================
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

    // Хэшируем пароль
    const passwordHash = hashPassword(password);

    const payload = {
      name,
      email,
      passwordHash, // сохраняем только хэш
      address: defaultAddress,
    };

    const { data } = await api.post<User>("/users", payload);

    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (err: any) {
    return rejectWithValue("Ошибка при регистрации");
  }
});

// ==============================
// ОБНОВЛЕНИЕ АДРЕСА
// ==============================
export const updateUserAddress = createAsyncThunk<
  User,
  { userId: string; address: Address },
  { rejectValue: string }
>("auth/updateAddress", async ({ userId, address }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<User>(`/users/${userId}`, { address });
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch {
    return rejectWithValue("Ошибка при обновлении адреса");
  }
});

// ==============================
// ОБНОВЛЕНИЕ ПРОФИЛЯ
// ==============================
export const saveUserProfile = createAsyncThunk<
  User,
  { userId: string; name: string; email: string },
  { rejectValue: string }
>("auth/saveProfile", async ({ userId, name, email }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch<User>(`/users/${userId}`, { name, email });
    await AsyncStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch {
    return rejectWithValue("Ошибка при сохранении профиля");
  }
});

// ==============================
// СЛАЙС
// ==============================
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Ошибка при входе";
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "success";
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload || "Ошибка при регистрации";
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuth = (state: RootState) => state.auth.isAuth;

export const { login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
