import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import errorImg from "../../assets/images/error.png";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
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

  // Селекторы
  const { categoryId, sort, searchValue } = useAppSelector(selectFilter);
  const pizzas = useAppSelector(selectPizzaItems);
  const status = useAppSelector(selectPizzaStatus);
  const error = useAppSelector(selectPizzaError);
  const cartItems = useAppSelector(selectCartItems);

  // Формируем строку запроса
  const getQueryString = useCallback(() => {
    const params = new URLSearchParams();

    if (sort.sortProperty) {
      const order = sort.sortProperty.includes("-") ? "asc" : "desc";
      const sorting = sort.sortProperty.replace("-", "");
      params.append("sortBy", sorting);
      params.append("order", order);
    }

    if (categoryId !== 0) {
      params.append("category", categoryId.toString());
    }

    if (searchValue) {
      params.append("search", searchValue);
    }

    return params.toString();
  }, [categoryId, sort.sortProperty, searchValue]);

  // Загрузка пицц
  const loadPizzas = useCallback(async () => {
    const queryString = getQueryString();
    dispatch(fetchPizzas({ queryString }));
  }, [dispatch, getQueryString]);

  // Первая загрузка и обновление при изменении фильтров
  useEffect(() => {
    loadPizzas();
  }, [loadPizzas]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      dispatch(resetPizzas());
    };
  }, [dispatch]);

  const renderError = () => (
    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>
        {error || "Произошла ошибка при загрузке 😕"}
      </Text>
      <Image source={errorImg} style={styles.notFoundImage} />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>
        {searchValue
          ? `По запросу "${searchValue}" ничего не найдено 😕`
          : "Пицц пока нет 😕"}
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

    if (pizzas.length === 0) {
      return renderEmpty();
    }

    return (
      <View style={styles.itemsGrid}>
        {pizzas.map((pizza) => (
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
        {searchValue ? `Поиск: "${searchValue}"` : "Все пиццы"}
      </Text>

      {renderContent()}
    </ScrollView>
  );
};

export default Main;
