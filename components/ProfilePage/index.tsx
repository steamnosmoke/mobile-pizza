import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  logout,
  saveUserProfile,
  updateUserAddress,
} from "../../redux/slices/authSlice";
import { Address } from "../../types/authTypes";
import { AddressForm } from "./AddressForm";
import { AddressInfo } from "./AddressInfo";
import { OrdersList } from "./OrderList";
import { styles } from "./styles";
import { UserForm } from "./UserForm";
import { UserInfo } from "./UserInfo";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const [address, setAddress] = useState<Address>(
    user?.address || {
      street: "",
      house: "",
      apartment: "",
      entrance: "",
      floor: "",
      intercom: "",
    }
  );
    const router = useRouter();

  const onLogout = () =>{
    dispatch(logout());
    router.push("/(auth)/login")
  }

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setAddress(
      user?.address || {
        street: "",
        house: "",
        apartment: "",
        entrance: "",
        floor: "",
        intercom: "",
      }
    );
  }, [user]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const saveAddress = async () => {
    if (!address.street || !address.house) {
      Alert.alert(
        "Error",
        "The street and the house number are required to fill in"
      );
      return;
    }

    if (user) {
      try {
        await dispatch(
          updateUserAddress({
            userId: user.id,
            address,
          })
        ).unwrap();
        setEditingAddress(false);
        Alert.alert("✅ Success", "The delivery address has been updated");
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Couldn't update address");
      }
    }
  };

  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "The name and email cannot be empty.");
      return;
    }

    if (user) {
      try {
        await dispatch(
          saveUserProfile({ userId: user.id, name, email })
        ).unwrap();
        setEditing(false);
        Alert.alert("✅ Success", "The profile has been updated");
      } catch (error: any) {
        Alert.alert("Error", error?.message || "Couldn't save data");
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        {editing ? (
          <UserForm
            name={name}
            email={email}
            onChangeName={setName}
            onChangeEmail={setEmail}
            onSave={saveProfile}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <UserInfo
            name={user?.name}
            email={user?.email}
            onEdit={() => setEditing(true)}
          />
        )}
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {editingAddress ? (
          <AddressForm
            address={address}
            onChangeAddress={handleAddressChange}
            onSave={saveAddress}
            onCancel={() => setEditingAddress(false)}
          />
        ) : (
          <AddressInfo
            address={user?.address}
            onEdit={() => setEditingAddress(true)}
          />
        )}
      </View>

      <OrdersList
        isOpen={ordersOpen}
        onToggle={() => setOrdersOpen(!ordersOpen)}
        userId={user?.id}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
