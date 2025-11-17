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
      <Text style={styles.label}>Улица *</Text>
      <TextInput
        style={styles.input}
        value={address.street}
        onChangeText={(value) => onChangeAddress("street", value)}
        placeholder="Введите улицу"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Дом *</Text>
      <TextInput
        style={styles.input}
        value={address.house}
        onChangeText={(value) => onChangeAddress("house", value)}
        placeholder="Введите номер дома"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Квартира</Text>
      <TextInput
        style={styles.input}
        value={address.apartment}
        onChangeText={(value) => onChangeAddress("apartment", value)}
        placeholder="Введите номер квартиры"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Подъезд</Text>
      <TextInput
        style={styles.input}
        value={address.entrance}
        onChangeText={(value) => onChangeAddress("entrance", value)}
        placeholder="Введите номер подъезда"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Этаж</Text>
      <TextInput
        style={styles.input}
        value={address.floor}
        onChangeText={(value) => onChangeAddress("floor", value)}
        placeholder="Введите этаж"
      />
    </View>

    <View style={styles.field}>
      <Text style={styles.label}>Домофон</Text>
      <TextInput
        style={styles.input}
        value={address.intercom}
        onChangeText={(value) => onChangeAddress("intercom", value)}
        placeholder="Код домофона"
      />
    </View>

    <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
      <Text style={styles.primaryText}>Сохранить адрес</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.secondaryBtn} onPress={onCancel}>
      <Text style={styles.secondaryText}>Отменить</Text>
    </TouchableOpacity>
  </View>
);
