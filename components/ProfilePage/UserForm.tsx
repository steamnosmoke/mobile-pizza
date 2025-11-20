import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "./styles";

interface UserFormProps {
  name: string;
  email: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const UserForm = ({
  name,
  email,
  onChangeName,
  onChangeEmail,
  onSave,
  onCancel,
}: UserFormProps) => {
  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onChangeName}
          placeholder="Enter имя"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onChangeEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
        <Text style={styles.primaryText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={onCancel}>
        <Text style={styles.secondaryText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};
