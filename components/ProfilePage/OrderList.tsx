import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
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
    fetchOrders();
  }, [userId]);

  const renderItem = (item: OrderItem) => (
    <View key={String(item.id)} style={styles.orderItem}>
      <Text style={styles.orderName}>Order #{item.id}</Text>
      <Text style={styles.orderStatus}>{item.status || "—"}</Text>
      <Text style={styles.orderDate}>
        {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
      </Text>
      <Text style={styles.orderDate}>Summary: {item.total} ₽</Text>
      <Text style={styles.orderDate}>Items: {item.items?.length ?? 0}</Text>
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
        <Text style={styles.ordersTitle}>My orders ({orders.length})</Text>
        <TouchableOpacity onPress={onToggle}>
          <Text style={{ color: styles.ordersTitle.color }}>
            {isOpen ? "Wrap" : "Unwrap"}
          </Text>
        </TouchableOpacity>
      </View>

      {isOpen && (
        <View style={[styles.orderList, { marginTop: 8 }]}>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={styles.orderStatus}>Error: {error}</Text>
          ) : orders.length === 0 ? (
            <Text style={styles.orderStatus}>There are no orders yet</Text>
          ) : (
            <View>{orders.map(renderItem)}</View>
          )}
        </View>
      )}
    </View>
  );
};
