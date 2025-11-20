import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import errorImg from "../../assets/images/error.png";
import { selectCartItems } from "../../redux/slices/cartSlice";
import { selectFilter } from "../../redux/slices/filterSlice";
import {
  fetchPizzas,
  resetPizzas,
  selectPizzaError,
  selectPizzaItems,
  selectPizzaStatus,
} from "../../redux/slices/pizzaSlice";
import Categories from "../Categories";
import Header from "../Header";
import PizzaCard from "../PizzaCard";
import Sort from "../Sort";
import { styles } from "./styles";

const Main = () => {
  const dispatch = useAppDispatch();

  const { categoryId, sort, searchValue } = useAppSelector(selectFilter);
  const allPizzas = useAppSelector(selectPizzaItems);
  const status = useAppSelector(selectPizzaStatus);
  const error = useAppSelector(selectPizzaError);
  const cartItems = useAppSelector(selectCartItems);

  const filteredAndSortedPizzas = useMemo(() => {
    let filtered = [...allPizzas];

    if (categoryId !== 0) {
      filtered = filtered.filter((pizza) => pizza.category === categoryId);
    }

    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter((pizza) =>
        pizza.name.toLowerCase().includes(searchLower)
      );
    }

    if (sort.sortProperty) {
      filtered.sort((a, b) => {
        switch (sort.sortProperty) {
          case "name":
            return a.name.localeCompare(b.name);

          case "-name":
            return b.name.localeCompare(a.name);

          case "price":
            const priceA = a.price[0]?.[0] || 0;
            const priceB = b.price[0]?.[0] || 0;
            return priceA - priceB;

          case "-price":
            const priceA2 = a.price[0]?.[0] || 0;
            const priceB2 = b.price[0]?.[0] || 0;
            return priceB2 - priceA2;

          case "rating":
            const ratingA =
              typeof a.rating === "string" ? parseFloat(a.rating) : a.rating;
            const ratingB =
              typeof b.rating === "string" ? parseFloat(b.rating) : b.rating;
            return ratingA - ratingB;

          case "-rating":
            const ratingA2 =
              typeof a.rating === "string" ? parseFloat(a.rating) : a.rating;
            const ratingB2 =
              typeof b.rating === "string" ? parseFloat(b.rating) : b.rating;
            return ratingB2 - ratingA2;

          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [allPizzas, categoryId, sort.sortProperty, searchValue]);

  const loadPizzas = useCallback(async () => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  useEffect(() => {
    loadPizzas();
  }, [loadPizzas]);

  useEffect(() => {
    return () => {
      dispatch(resetPizzas());
    };
  }, [dispatch]);

  const renderError = () => (
    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>{error || "Error  😕"}</Text>
      <Image source={errorImg} style={styles.notFoundImage} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>
        {searchValue
          ? `Nothing was found for the query "${searchValue}"😕`
          : "There are no pizzas yet 😕"}
      </Text>
      <Image source={errorImg} style={styles.notFoundImage} />
    </View>
  );

  const renderContent = () => {
    if (status === "loading") {
      return (
        <View style={styles.notFound}>
          <ActivityIndicator size="large" color="#fe5f1e" />
        </View>
      );
    }

    if (status === "error") {
      return renderError();
    }

    if (filteredAndSortedPizzas.length === 0) {
      return renderEmpty();
    }

    return (
      <View style={styles.itemsGrid}>
        {filteredAndSortedPizzas.map((pizza) => (
          <PizzaCard
            key={pizza.id}
            {...pizza}
            cartCount={cartItems
              .filter((item) => item.id === pizza.id)
              .reduce((sum, item) => sum + (item.count || 0), 0)}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.wrapper}
      refreshControl={
        <RefreshControl
          refreshing={status === "loading"}
          onRefresh={loadPizzas}
          colors={["#fe5f1e"]}
        />
      }
    >
      <Header />

      <View style={styles.contentTop}>
        <Categories />
        <Sort />
      </View>

      <Text style={styles.title}>
        {searchValue ? `Search: "${searchValue}"` : "All Pizzas"}
      </Text>

      {renderContent()}
    </ScrollView>
  );
};

export default Main;
