import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleSortPopup,
  changeSortType,
  selectFilter,
} from "../../redux/slices/filterSlice";
import { styles } from "./styles";

type SortItem = { name: string; sortProperty: string };

export const sorts: SortItem[] = [
  { name: "популярности ↓", sortProperty: "rating" },
  { name: "популярности ↑", sortProperty: "-rating" },
  { name: "цене ↓", sortProperty: "price" },
  { name: "цене ↑", sortProperty: "-price" },
  { name: "алфавиту ↓", sortProperty: "name" },
  { name: "алфавиту ↑", sortProperty: "-name" },
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
      {/* Кнопка сортировки */}
      <TouchableOpacity style={styles.label} onPress={togglePopup}>
        <Text style={styles.labelText}>
          Сортировка по: <Text style={styles.bold}>{sort.name}</Text>
        </Text>
        <Text style={[styles.arrow, sortOpened && styles.arrowRotated]}>⌃</Text>
      </TouchableOpacity>

      {/* Popup окно сортировки */}
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
            keyExtractor={(item) => item.sortProperty}
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

