import { StyleSheet } from "react-native";
import { CARD_HEIGHT, CARD_WIDTH } from "../MainPage/styles";

const imageSize = Math.round(CARD_WIDTH - 24);

export const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 3,
    // распределяем пространство: верхняя часть + фиксированное пространство под снизу
    justifyContent: "space-between",
  },
  // обёртка для содержимого, чтобы можно было использовать marginTop: 'auto'
  content: {
    width: "100%",
    flexGrow: 1,
  },
  image: {
    width: imageSize,
    height: imageSize,
    resizeMode: "contain",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  selector: {
    width: "100%",
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    // НЕ даём селектору бесконечно расти — ограничим высоту и включим прокрутку внутри, если нужно
    maxHeight: 110, // подберите значение под дизайн (110 — примерно 2 ряда опций)
    // overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 6,
    gap: 0,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    marginVertical: 4,
  },
  optionActive: {
    backgroundColor: "#EB5A1E",
  },
  optionText: {
    color: "#333",
    fontSize: 13,
  },
  optionTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  bottom: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Подвинем вниз: если верхнее содержимое займёт меньше места, bottom будет внизу карточки
    marginTop: "auto",
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EB5A1E",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    // чтобы кнопка была поверх фона селектора, при необходимости
    zIndex: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  badge: {
    backgroundColor: "#fff",
    color: "#EB5A1E",
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: "bold",
    fontSize: 12,
  },
});
