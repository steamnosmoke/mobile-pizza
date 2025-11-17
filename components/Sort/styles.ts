import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  labelText: {
    fontSize: 16,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 16,
    color: "#333",
    transform: [{ rotate: "0deg" }],
  },
  arrowRotated: {
    transform: [{ rotate: "180deg" }],
  },
  popup: {
    position: "absolute",
    top: "35%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  activeOption: {
    backgroundColor: "#f0f0f0",
  },
  activeOptionText: {
    fontWeight: "bold",
    color: "#EB5A1E",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
