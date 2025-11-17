import React, { useCallback, useMemo, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addItem, TCartItem } from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";
import type { Pizza } from "../../types/productTypes";
import { styles } from "./styles";

const doughTypes = ["тонкое", "традиционное"];

interface PizzaCardProps extends Pizza {
  cartCount?: number;
}

const PizzaCard: React.FC<PizzaCardProps> = ({
  id,
  name,
  price,
  imageUrl,
  sizes,
  types,
  cartCount = 0,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s: RootState) => s.auth.user);

  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [activeSizeIndex, setActiveSizeIndex] = useState(0);

  const currentPrice = useMemo(() => {
    try {
      const typePrice = price[activeTypeIndex];
      if (!typePrice) return 0;
      const sizePrice = typePrice[activeSizeIndex];
      if (!sizePrice) return 0;
      return sizePrice;
    } catch (err) {
      console.error("Error calculating price:", err);
      return 0;
    }
  }, [price, activeTypeIndex, activeSizeIndex]);

  const handleAdd = useCallback(() => {
    if (!user) {
      Alert.alert(
        "Требуется авторизация",
        "Пожалуйста, войдите в аккаунт чтобы добавить товар в корзину",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    const item: TCartItem = {
      id,
      name,
      imageUrl,
      type: activeTypeIndex,
      size: sizes[activeSizeIndex],
      price: currentPrice,
      count: 1,
    };

    dispatch(addItem(item));
  }, [
    dispatch,
    user,
    id,
    name,
    imageUrl,
    activeTypeIndex,
    activeSizeIndex,
    currentPrice,
    sizes,
  ]);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {name}
        </Text>

        <View style={styles.selector}>
          <View style={styles.row}>
            {types.map((typeId) => (
              <TouchableOpacity
                key={typeId}
                style={[
                  styles.option,
                  activeTypeIndex === typeId && styles.optionActive,
                ]}
                onPress={() => setActiveTypeIndex(typeId)}
              >
                <Text
                  style={[
                    styles.optionText,
                    activeTypeIndex === typeId && styles.optionTextActive,
                  ]}
                >
                  {doughTypes[typeId]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            {sizes.map((size, index) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.option,
                  activeSizeIndex === index && styles.optionActive,
                ]}
                onPress={() => setActiveSizeIndex(index)}
              >
                <Text
                  style={[
                    styles.optionText,
                    activeSizeIndex === index && styles.optionTextActive,
                  ]}
                >
                  {size} см
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.price}>{currentPrice} ₽</Text>
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Добавить</Text>
          {cartCount > 0 && <Text style={styles.badge}>{cartCount}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(PizzaCard);
