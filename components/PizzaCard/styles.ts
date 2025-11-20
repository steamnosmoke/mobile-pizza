import { StyleSheet } from "react-native";
import { CARD_WIDTH } from "../MainPage/styles";

const imageSize = Math.round(CARD_WIDTH - 24);

export const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    width: "100%",
    flexGrow: 1,
  },
  imageContainer: {
    width: imageSize,
    height: imageSize,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff", // фон контейнера
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "transparent",
    alignSelf: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
    height: 36,
  },
  selector: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginBottom: 8,
    justifyContent: "space-between",
    height: 100,
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
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginHorizontal: 4,
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    zIndex: 10,
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
