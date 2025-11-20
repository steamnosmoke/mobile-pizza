import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { changeCategory, selectFilter } from "../../redux/slices/filterSlice";
import { styles } from "./styles";

const categories = ["All", "Meat", "Vegetarian", "Grill", "Spicy"];

const Categories = () => {
  const { categoryId } = useSelector(selectFilter);
  const dispatch = useDispatch();

  const setCategory = (i: number) => {
    dispatch(changeCategory(i));
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {categories.map((el, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.item, categoryId === i && styles.activeItem]}
            onPress={() => setCategory(i)}
          >
            <Text
              style={[
                styles.itemText,
                categoryId === i && styles.activeItemText,
              ]}
            >
              {el}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Categories;
