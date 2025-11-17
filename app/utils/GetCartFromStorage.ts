import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItemType } from "../redux/slices/cartSlice";
import { CalcTotalPrice } from "./CalcTotalPrice";

export const GetCart = async (): Promise<{
  items: CartItemType[];
  totalPrice: number;
}> => {
  try {
    const data = await AsyncStorage.getItem("cart");
    const items: CartItemType[] = data ? JSON.parse(data) : [];
    const totalPrice = CalcTotalPrice(items);
    return { items, totalPrice };
  } catch (error) {
    console.error("Ошибка при загрузке корзины:", error);
    return { items: [], totalPrice: 0 };
  }
};
