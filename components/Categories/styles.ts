import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },

  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginVertical: 10,
  },

  item: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  activeItem: {
    backgroundColor: "#fe5f1e",
    borderColor: "#fe5f1e",
  },

  itemText: {
    fontSize: 16,
    color: "#333",
  },

  activeItemText: {
    color: "#fff",
    fontWeight: "bold",
  },

  popupButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 10,
  },

  arrow: {
    fontSize: 16,
    color: "#2C2C2C",
  },

  label: {
    fontWeight: "bold",
    fontSize: 16,
  },

  selected: {
    fontSize: 16,
    color: "#fe5f1e",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "80%",
    maxHeight: "60%",
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  popupItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  popupText: {
    fontSize: 16,
    color: "#333",
  },

  activePopupItem: {
    backgroundColor: "#fe5f1e",
  },

  activePopupText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
