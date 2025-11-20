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
          st. {address.street}, b. {address.house}
          {address.apartment ? `, flat ${address.apartment}` : ""}
        </Text>
        {(address.entrance || address.floor || address.intercom) && (
          <Text style={styles.addressDetails}>
            {address.entrance ? `entrance ${address.entrance}, ` : ""}
            {address.floor ? `floor ${address.floor}, ` : ""}
            {address.intercom ? `doorphone: ${address.intercom}` : ""}
          </Text>
        )}
      </>
    ) : (
      <Text style={styles.noAddress}>The address is not specified</Text>
    )}
    <TouchableOpacity style={styles.primaryBtn} onPress={onEdit}>
      <Text style={styles.primaryText}>
        {address ? "Edit address" : "Add address"}
      </Text>
    </TouchableOpacity>
  </View>
);
