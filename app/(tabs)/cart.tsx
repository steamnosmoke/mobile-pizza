import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CartEmpty from "../../components/CartEmpty";
import CartItem from "../../components/CartItem";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  clearCart,
  createOrder,
  fetchUserCart,
  saveUserCart,
  selectCart,
  selectCartTotalPrice,
} from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, status } = useAppSelector(selectCart);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const user = useAppSelector((s: RootState) => s.auth.user);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const initialAutoSaveRef = useRef(true);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserCart(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (!user?.id) return;

    if (initialAutoSaveRef.current) {
      initialAutoSaveRef.current = false;
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // @ts-ignore setTimeout returns number
    saveTimeoutRef.current = setTimeout(() => {
      dispatch(saveUserCart({ userId: user.id, items }));
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [items, user?.id, dispatch]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const onPressPay = () => {
    if (!user) {
      Alert.alert(
        "Войдите в аккаунт",
        "Пожалуйста, войдите в аккаунт перед оформлением заказа"
      );
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleAddAddress = () => {
    setConfirmModalVisible(false);
    router.push("/profile");
  };

  const handleEditAddress = () => {
    setConfirmModalVisible(false);
    router.push("/profile");
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      Alert.alert("Ошибка", "Пользователь не найден");
      return;
    }

    const address = user.address;
    if (!address || !address.street || !address.house) {
      Alert.alert(
        "Ошибка",
        "Пожалуйста, добавьте адрес доставки перед оформлением заказа"
      );
      return;
    }

    try {
      setOrderLoading(true);
      console.log("[CartScreen] creating order", {
        userId: user.id,
        items,
        totalPrice,
      });

      const createdOrder = await dispatch(
        createOrder({
          userId: user.id,
          items,
          address,
          total: totalPrice,
        })
      ).unwrap();

      // clear local cart and persist empty cart on server
      dispatch(clearCart());
      await dispatch(saveUserCart({ userId: user.id, items: [] })).unwrap();

      setConfirmModalVisible(false);
      Alert.alert(
        "✅ Заказ оформлен",
        `Спасибо! Ваш заказ #${createdOrder.id} принят.`
      );

      router.push("/");
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Не удалось оформить заказ. Попробуйте позже.";
      console.warn("[CartScreen] createOrder failed:", err);
      Alert.alert("Ошибка оформления заказа", message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <View style={styles.container}>
        <Text>Загрузка корзины...</Text>
      </View>
    );
  }

  if (!items || items.length === 0) {
    return <CartEmpty />;
  }

  const AddressPreview = () => {
    const addr = user?.address;
    if (!addr || (!addr.street && !addr.house)) {
      return (
        <Text style={{ marginBottom: 12, fontStyle: "italic" }}>
          Адрес не указан
        </Text>
      );
    }
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          ул. {addr.street}, д. {addr.house}
          {addr.apartment ? `, кв. ${addr.apartment}` : ""}
        </Text>
        {(addr.entrance || addr.floor || addr.intercom) && (
          <Text style={{ color: "#666", marginTop: 6 }}>
            {addr.entrance ? `подъезд ${addr.entrance}, ` : ""}
            {addr.floor ? `этаж ${addr.floor}, ` : ""}
            {addr.intercom ? `домофон: ${addr.intercom}` : ""}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Корзина</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Очистить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {items.map((item) => (
          <CartItem key={`${item.id}_${item.type}_${item.size}`} {...item} />
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        <View style={styles.totalBlock}>
          <Text style={styles.totalText}>Итого:</Text>
          <Text style={styles.totalPrice}>{totalPrice} ₽</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, orderLoading && styles.payButtonDisabled]}
          disabled={orderLoading}
          onPress={onPressPay}
        >
          <Text style={styles.payButtonText}>
            {orderLoading ? "Оформление..." : "Оплатить"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Подтверждение адреса</Text>

            <AddressPreview />

            {!user?.address || (!user.address.street && !user.address.house) ? (
              <>
                <Text style={{ marginBottom: 12 }}>
                  Адрес доставки обязателен для оформления заказа.
                </Text>
                <TouchableOpacity
                  style={modalStyles.primaryBtn}
                  onPress={handleAddAddress}
                >
                  <Text style={modalStyles.primaryText}>Добавить адрес</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.secondaryBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={modalStyles.secondaryText}>Отменить</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={modalStyles.primaryBtn}
                  onPress={handleConfirmOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={modalStyles.primaryText}>
                      Подтвердить заказ
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={modalStyles.secondaryBtn}
                  onPress={handleEditAddress}
                >
                  <Text style={modalStyles.secondaryText}>Изменить адрес</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={modalStyles.tertiaryBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={modalStyles.tertiaryText}>Назад</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: "700" },
  clearText: { fontSize: 14, color: "#EB5A1E" },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  totalBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalText: { fontSize: 18, color: "#444" },
  totalPrice: { fontSize: 20, fontWeight: "700", color: "#000" },
  payButton: {
    backgroundColor: "#EB5A1E",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  payButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  payButtonDisabled: {
    opacity: 0.7,
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: "#EB5A1E",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryText: {
    color: "#333",
    fontSize: 15,
  },
  tertiaryBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  tertiaryText: {
    color: "#666",
    fontSize: 14,
  },
});
