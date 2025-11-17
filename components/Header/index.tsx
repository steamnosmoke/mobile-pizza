import debounce from "lodash.debounce";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Image,
  TextInput as RNTextInput,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/slices/filterSlice";

import clearIcon from "../../assets/images/icons/clear.png";
import searchIcon from "../../assets/images/icons/search.png";

export default function Search() {
  const [value, setValue] = useState<string>("");
  const refSearch = useRef<RNTextInput | null>(null);
  const dispatch = useDispatch();

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        dispatch(setSearchValue(text));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const onChangeText = useCallback(
    (text: string) => {
      setValue(text);
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const clearInput = useCallback(() => {
    dispatch(setSearchValue(""));
    setValue("");
    refSearch.current?.focus();
  }, [dispatch]);

  return (
    <View style={styles.searchContainer}>
      <Image source={searchIcon} style={styles.icon} />
      <TextInput
        ref={refSearch}
        style={styles.input}
        placeholder="May be Pepperoni?"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={clearInput} style={styles.clearButton}>
          <Image source={clearIcon} style={styles.clearIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "relative",
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#555",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#000",
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: "#555",
  },
});
