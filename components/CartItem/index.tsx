import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import {
  addItem,
  minusItem,
  removeItem,
  TCartItem,
} from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";
import styles from "./styles";

const types = ["thin", "traditional"];

type Props = TCartItem;

const CartItem: React.FC<Props> = ({
  id,
  name,
  type,
  size,
  price,
  imageUrl,
  count,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s: RootState) => s.auth.user);

  if (!user) return null;

  const handleRemove = () => {
    Alert.alert("Removing", `Remove ${name} from your cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          dispatch(removeItem({ id, size, type }));
        },
      },
    ]);
  };

  const handleIncrement = () => {
    dispatch(addItem({ id, name, type, size, price, imageUrl, count: 1 }));
  };

  const handleDecrement = () => {
    dispatch(minusItem({ id, size, type }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.details}>
            {types[type]} dough, {size}sm
          </Text>
          <Text style={styles.price}>{price * count} ₽</Text>
        </View>

        <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.counter}>
          <TouchableOpacity onPress={handleDecrement} style={styles.circleBtn}>
            <Text style={styles.btnText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.count}>{count}</Text>

          <TouchableOpacity onPress={handleIncrement} style={styles.circleBtn}>
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
