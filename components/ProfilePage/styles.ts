import { StyleSheet } from "react-native";

export const COLORS = {
  ORANGE: "#EB5A1E",
  TEXT: "#222",
  GRAY: "#EDEDED",
  LIGHT_GRAY: "#FAFAFA",
  ERROR: "#E53935",
  WHITE: "#FFFFFF",
  DARK_GRAY: "#666666",
  BORDER: "#CCCCCC",
};

export const styles = StyleSheet.create({
  // Основные контейнеры
  container: {
    marginTop: 50,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    alignItems: "center",
    paddingBottom: 40,
  },
  section: {
    width: "90%",
    marginTop: 20,
  },

  // Формы
  form: {
    width: "100%",
    marginTop: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.GRAY,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: COLORS.LIGHT_GRAY,
  },

  // Кнопки
  primaryBtn: {
    backgroundColor: COLORS.ORANGE,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  primaryText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryText: {
    color: COLORS.DARK_GRAY,
    fontSize: 15,
  },
  logoutBtn: {
    marginTop: 40,
  },
  logoutText: {
    color: COLORS.ERROR,
    fontSize: 15,
  },

  // Информация о пользователе
  infoBox: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.TEXT,
  },
  email: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    marginBottom: 20,
  },

  // Адрес
  addressBox: {
    width: "90%",
    marginTop: 30,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT,
    marginBottom: 15,
  },
  addressInfo: {
    alignItems: "center",
  },
  addressText: {
    fontSize: 16,
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  addressDetails: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    marginBottom: 15,
  },
  noAddress: {
    fontSize: 16,
    color: COLORS.DARK_GRAY,
    marginBottom: 15,
    fontStyle: "italic",
  },

  // Заказы
  ordersBox: {
    width: "90%",
    marginTop: 30,
  },
  ordersTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.ORANGE,
    marginBottom: 8,
  },
  orderList: {
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 10,
    padding: 10,
  },
  orderItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingVertical: 10,
  },
  orderName: {
    fontSize: 15,
    color: COLORS.TEXT,
  },
  orderStatus: {
    fontSize: 13,
    color: COLORS.DARK_GRAY,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.DARK_GRAY,
    marginTop: 4,
  },

  // Разделители
  divider: {
    height: 1,
    backgroundColor: COLORS.GRAY,
    width: "100%",
    marginVertical: 20,
  },

  // Дополнительные стили для форм
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    marginBottom: 6,
  },
  required: {
    color: COLORS.ERROR,
    marginLeft: 4,
  },

  // Анимации и состояния
  buttonDisabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.8,
  },

  // Адаптивные стили
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },

  // Вспомогательные стили
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  mb10: { marginBottom: 10 },
  mb20: { marginBottom: 20 },
  p10: { padding: 10 },
  p20: { padding: 20 },
});
