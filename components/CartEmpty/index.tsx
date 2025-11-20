import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import cartEmpty from "../../assets/images/empty-cart.png";
import styles from "./styles";

const CartEmpty = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={cartEmpty} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Cart is empty 😕</Text>
      <Text style={styles.text}>
        You probably haven{"'"}t ordered a pizza yet. {"\n"}
        To order, go to the catalog.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartEmpty;

