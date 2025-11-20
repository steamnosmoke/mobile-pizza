import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
const padding = 16;
const gap = 8;
const cardWidth = (width - padding * 2 - gap) / 2;

// Высота карточки: можно подогнать — я беру коэффициент от ширины.
// При необходимости увеличьте/уменьшите коэффициент.
export const CARD_WIDTH = cardWidth;
export const CARD_HEIGHT = Math.round(cardWidth * 2.3);

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#fff",
    minHeight: "100%",
    paddingBottom: 16,
  },

  contentTop: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
    alignSelf: "center",
  },

  search: {
    width: "90%",
    height: 40,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginVertical: 30,
    textAlign: "center",
  },

  itemsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: gap,
    justifyContent: "space-between",
    paddingHorizontal: 0,
    alignItems: "flex-start",
    marginBottom: 16,
  },

  notFound: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },

  notFoundText: {
    fontSize: 28,
    textAlign: "center",
  },

  notFoundImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 20,
  },
});
