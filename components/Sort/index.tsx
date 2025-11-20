import React from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSortType,
  selectFilter,
  toggleSortPopup,
} from "../../redux/slices/filterSlice";
import { styles } from "./styles";

type SortItem = { name: string; sortProperty: string };

export const sorts: SortItem[] = [
  { name: "popularity ↓", sortProperty: "-rating" },
  { name: "popularity ↑", sortProperty: "rating" },
  { name: "price ↓", sortProperty: "-price" },
  { name: "price ↑", sortProperty: "price" },
  { name: "alphabet ↓", sortProperty: "-name" },
  { name: "alphabet ↑", sortProperty: "name" },
];

const Sort: React.FC = () => {
  const dispatch = useDispatch();
  const { sortOpened, sort } = useSelector(selectFilter);

  const togglePopup = () => {
    dispatch(toggleSortPopup());
  };

  const setSortType = (el: SortItem) => {
    dispatch(changeSortType(el));
    togglePopup();
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.label} onPress={togglePopup}>
        <Text style={styles.labelText}>
          Sorting by: <Text style={styles.bold}>{sort.name}</Text>
        </Text>
        <Text style={[styles.arrow, sortOpened && styles.arrowRotated]}>⌃</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={sortOpened}
        animationType="fade"
        onRequestClose={togglePopup}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={togglePopup}
        />

        <View style={styles.popup}>
          <FlatList
            data={sorts}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSortType(item)}
                style={[
                  styles.option,
                  sort.name === item.name && styles.activeOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    sort.name === item.name && styles.activeOptionText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Sort;

