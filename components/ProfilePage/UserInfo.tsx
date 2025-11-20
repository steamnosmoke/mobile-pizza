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
      <Text style={styles.name}>{name || "User"}</Text>
      <Text style={styles.email}>{email || "Email not specified"}</Text>

      <TouchableOpacity style={styles.primaryBtn} onPress={onEdit}>
        <Text style={styles.primaryText}>Edit profile</Text>
      </TouchableOpacity>
    </View>
  );
};
