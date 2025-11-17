import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface UserInfoProps {
  name?: string;
  email?: string;
  onEdit: () => void;
}

export const UserInfo = ({ name, email, onEdit }: UserInfoProps) => {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.name}>{name || "Пользователь"}</Text>
      <Text style={styles.email}>{email || "Email не указан"}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={onEdit}>
        <Text style={styles.primaryText}>Редактировать профиль</Text>
      </TouchableOpacity>
    </View>
  );
};
