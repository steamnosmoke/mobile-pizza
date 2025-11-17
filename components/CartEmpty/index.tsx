import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import cartEmpty from "../../assets/images/empty-cart.png";

const CartEmpty = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={cartEmpty} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Корзина пустая 😕</Text>
      <Text style={styles.text}>
        Вероятнее всего, вы ещё не заказывали пиццу. {"\n"}
        Чтобы заказать, перейдите в каталог.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Вернуться назад</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartEmpty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#EB5A1E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
