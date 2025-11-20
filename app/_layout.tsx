import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useRouter, useSegments } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { login, logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";
import { User } from "../types/authTypes";

// Константы
const ROUTES = {
  AUTH: "/(auth)/login",
  TABS: "/(tabs)",
} as const;

// Утилиты для работы с хранилищем
const storage = {
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error("Storage getUser error:", err);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (err) {
      console.error("Storage setUser error:", err);
    }
  },

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem("user");
    } catch (err) {
      console.error("Storage clearUser error:", err);
    }
  },
};

// Компоненты состояний
const LoadingScreen = () => (
  <SafeAreaView style={styles.loadingContainer}>
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    <ActivityIndicator size="large" color="#EB5A1E" />
  </SafeAreaView>
);

const ErrorScreen = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor="#fff" barStyle="dark-content" />
    <Text style={styles.errorText}>Ошибка: {error}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryButtonText}>Retry</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

function RootContent() {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await storage.getUser();

      if (user) {
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown Error";
      console.error("Auth check error:", errorMessage);
      setError(errorMessage);
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Проверка аутентификации при запуске
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Навигация на основе состояния аутентификации
  useEffect(() => {
    if (loading || segments.length === 0) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    let isSubscribed = true;

    storage
      .getUser()
      .then((user) => {
        if (!isSubscribed) return;

        const isAuth = !!user;

        if (!isAuth && !inAuthGroup) {
          router.replace(ROUTES.AUTH);
        } else if (isAuth && !inTabsGroup) {
          router.replace(ROUTES.TABS);
        }
      })
      .catch((err) => {
        console.error("Navigation error:", err);
        router.replace(ROUTES.AUTH);
      });

    return () => {
      isSubscribed = false;
    };
  }, [loading, segments, router]);

  // Рендер состояний
  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={checkAuth} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Slot />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    color: "#EB5A1E",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#EB5A1E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
