import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch } from "../../redux/hooks";
import { registerUser } from "../../redux/slices/authSlice";

export default function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (isSubmitting) return;

    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Заполните все поля");
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(registerUser({ name, email, password })).unwrap();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(
        "Ошибка",
        error?.message || "Произошла ошибка при регистрации"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        placeholder="Имя"
        style={styles.input}
        value={name}
        onChangeText={setName}
        editable={!isSubmitting}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isSubmitting}
      />
      <TextInput
        placeholder="Пароль"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isSubmitting}
      />

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Создать аккаунт</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        disabled={isSubmitting}
      >
        <Text style={styles.linkText}>Уже есть аккаунт? Войти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#fe5f1e",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    marginTop: 16,
    textAlign: "center",
    color: "#fe5f1e",
    fontSize: 14,
  },
});
