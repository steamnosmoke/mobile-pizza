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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { setSearchValue } from "../../redux/slices/filterSlice";

import clearIcon from "../../assets/images/icons/clear.png";
import searchIcon from "../../assets/images/icons/search.png";
import styles from "./styles";

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

