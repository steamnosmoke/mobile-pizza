import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Address } from "../../types/authTypes";
import { styles } from "./styles";

interface AddressFormProps {
  address: Address;
  onChangeAddress: (field: keyof Address, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const AddressForm = ({
  address,
  onChangeAddress,
  onSave,
  onCancel,
}: AddressFormProps) => (
  <View style={styles.form}>
    <View style={styles.field}>
      <Text style={styles.label}>Street *</Text>
      <TextInput
        style={styles.input}
        value={address.street}
        onChangeText={(value) => onChangeAddress("street", value)}
        placeholder="Street"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Building *</Text>
      <TextInput
        style={styles.input}
        value={address.house}
        onChangeText={(value) => onChangeAddress("house", value)}
        placeholder="Enter building number"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Flat number</Text>
      <TextInput
        style={styles.input}
        value={address.apartment}
        onChangeText={(value) => onChangeAddress("apartment", value)}
        placeholder="Enter flat number"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Entrance</Text>
      <TextInput
        style={styles.input}
        value={address.entrance}
        onChangeText={(value) => onChangeAddress("entrance", value)}
        placeholder="Enter entrance number"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Floor</Text>
      <TextInput
        style={styles.input}
        value={address.floor}
        onChangeText={(value) => onChangeAddress("floor", value)}
        placeholder="Enter floor number"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Doorphone</Text>
      <TextInput
        style={styles.input}
        value={address.intercom}
        onChangeText={(value) => onChangeAddress("intercom", value)}
        placeholder="Enter doorphone code"
      />
    </View>

    <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
      <Text style={styles.primaryText}>Save address</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.secondaryBtn} onPress={onCancel}>
      <Text style={styles.secondaryText}>Cancel</Text>
    </TouchableOpacity>
  </View>
);
