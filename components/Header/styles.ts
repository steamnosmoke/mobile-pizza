import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: "relative",
    marginTop: 30,
    marginBottom: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#555",
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff"
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: "#555",
  },
});
export default styles;