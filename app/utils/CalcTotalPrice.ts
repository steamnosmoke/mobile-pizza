import { CartItemType } from "../redux/slices/cartSlice";

export const CalcTotalPrice = (items: CartItemType[]) => {
  return items.reduce((sum, obj) => {
    return Number(obj.price) * obj.count + sum;
  }, 0);
};
