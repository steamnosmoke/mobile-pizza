import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CartEmpty from "../../components/CartEmpty";
import CartItem from "../../components/CartItem";
import {
  clearCart,
  createOrder,
  fetchUserCart,
  saveUserCart,
  selectCart,
  selectCartTotalPrice,
} from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";
import { modalStyles, styles } from "./style";

export default function CartPage() {
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
      Alert.alert("Error", "user not found");
      return;
    }

    const address = user.address;
    if (!address || !address.street || !address.house) {
      Alert.alert(
        "Error",
        "Please add the shipping address before placing the order."
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
        "✅ The order has been placed",
        `Thank you! Your order #${createdOrder.id} accepted.`
      );

      router.push("/");
    } catch (err: any) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Couldn't place an order. Try again later.";
      console.warn("[CartScreen] createOrder failed:", err);
      Alert.alert("Order processing error", message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
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
          The address is not specified
        </Text>
      );
    }
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          st. {addr.street}, b. {addr.house}
          {addr.apartment ? `, flat ${addr.apartment}` : ""}
        </Text>
        {(addr.entrance || addr.floor || addr.intercom) && (
          <Text style={{ color: "#666", marginTop: 6 }}>
            {addr.entrance ? `entrance ${addr.entrance}, ` : ""}
            {addr.floor ? `floar ${addr.floor}, ` : ""}
            {addr.intercom ? `doorphone: ${addr.intercom}` : ""}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear</Text>
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
          <Text style={styles.totalText}>Summary:</Text>
          <Text style={styles.totalPrice}>{totalPrice} ₽</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, orderLoading && styles.payButtonDisabled]}
          disabled={orderLoading}
          onPress={onPressPay}
        >
          <Text style={styles.payButtonText}>
            {orderLoading ? "Processing..." : "Pay now"}
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
            <Text style={modalStyles.title}>Address confirmation</Text>

            <AddressPreview />

            {!user?.address || (!user.address.street && !user.address.house) ? (
              <>
                <Text style={{ marginBottom: 12 }}>
                  The delivery address is required for placing an order.
                </Text>
                <TouchableOpacity
                  style={modalStyles.primaryBtn}
                  onPress={handleAddAddress}
                >
                  <Text style={modalStyles.primaryText}>Add new address</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={modalStyles.secondaryBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={modalStyles.secondaryText}>Cancel</Text>
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
                      Confirm the order
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={modalStyles.secondaryBtn}
                  onPress={handleEditAddress}
                >
                  <Text style={modalStyles.secondaryText}>Edit address</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={modalStyles.tertiaryBtn}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={modalStyles.tertiaryText}>Go back</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
