import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#777",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EB5A1E",
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  circleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EB5A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 18,
    color: "#EB5A1E",
    fontWeight: "700",
  },
  count: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 14,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EB5A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#EB5A1E",
    fontSize: 14,
    fontWeight: "700",
  },
});
export default styles;