import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Address } from "../../types/authTypes";
import { styles } from "./styles";

interface AddressInfoProps {
  address?: Address;
  onEdit: () => void;
}

export const AddressInfo = ({ address, onEdit }: AddressInfoProps) => (
  <View style={styles.addressInfo}>
    {address ? (
      <>
        <Text style={styles.addressText}>
          ул. {address.street}, д. {address.house}
          {address.apartment ? `, кв. ${address.apartment}` : ""}
        </Text>
        {(address.entrance || address.floor || address.intercom) && (
          <Text style={styles.addressDetails}>
            {address.entrance ? `подъезд ${address.entrance}, ` : ""}
            {address.floor ? `этаж ${address.floor}, ` : ""}
            {address.intercom ? `домофон: ${address.intercom}` : ""}
          </Text>
        )}
      </>
    ) : (
      <Text style={styles.noAddress}>Адрес не указан</Text>
    )}
    <TouchableOpacity style={styles.primaryBtn} onPress={onEdit}>
      <Text style={styles.primaryText}>
        {address ? "Изменить адрес" : "Добавить адрес"}
      </Text>
    </TouchableOpacity>
  </View>
);
