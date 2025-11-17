import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../server/api";
import { styles } from "./styles";

type OrderItem = {
  id?: string;
  userId: string;
  items: any[];
  address: any;
  total: number;
  status?: string;
  createdAt?: string;
};

interface OrdersListProps {
  isOpen: boolean;
  onToggle: () => void;
  userId?: string | number | null;
}

export const OrdersList = ({ isOpen, onToggle, userId }: OrdersListProps) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!userId) {
      setOrders([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/${userId}`);
      const userData = res.data;
      const data = Array.isArray(userData?.orders) ? userData.orders : [];
      setOrders(
        data
          .slice()
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          )
      );
    } catch (err: any) {
      console.warn("Failed to fetch orders:", err);
      setError(err?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, userId]);

  const renderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderName}>Заказ #{item.id}</Text>
      <Text style={styles.orderStatus}>{item.status || "—"}</Text>
      <Text style={styles.orderDate}>
        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
      </Text>
      <Text style={styles.orderDate}>Сумма: {item.total} ₽</Text>
      <Text style={styles.orderDate}>Позиции: {item.items?.length ?? 0}</Text>
    </View>
  );

  return (
    <View style={styles.ordersBox}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.ordersTitle}>Мои заказы ({orders.length})</Text>
        <TouchableOpacity onPress={onToggle}>
          <Text style={{ color: styles.ordersTitle.color }}>
            {isOpen ? "Свернуть" : "Развернуть"}
          </Text>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={[styles.orderList, { marginTop: 8 }]}>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={styles.orderStatus}>Ошибка: {error}</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.orderStatus}>Заказов пока нет</Text>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
            />
          )}
        </View>
      )}
    </View>
  );
};
