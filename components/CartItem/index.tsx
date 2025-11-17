import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  removeItem,
  addItem,
  minusItem,
  selectCartItems,
  TCartItem,
} from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";

const types = ["тонкое", "традиционное"];

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
    Alert.alert("Удаление", `Удалить ${name} из корзины?`, [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
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
            {types[type]} тесто, {size} см
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

// ... styles остаются без изменений ...

export default CartItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EB5A1E",
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  circleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EB5A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
    color: "#EB5A1E",
    fontWeight: "700",
  },
  count: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 14,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EB5A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#EB5A1E",
    fontSize: 14,
    fontWeight: "700",
  },
});
