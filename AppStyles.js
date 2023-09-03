import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  noteContainer: {
    height: 70,
    backgroundColor: "#1F1F1F",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 1,
  },
  noteHeader: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#333333",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 10,
    fontSize: 16,
    color: "#FFFFFF",
    height: 50,
  },
  page2Container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 15,
  },
  detailsInput: {
    backgroundColor: "#333333",
    borderColor: "#555555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 10,
    fontSize: 16,
    height: 120,
    textAlignVertical: "top",
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#444444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  formattingButton: {
    flex: 1,
    backgroundColor: "#444444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  deleteButton: {
    height: 70,
    backgroundColor: "red",
    borderRadius: 10,
    width: "30%", // 30% of parent width
    justifyContent: "center", // Vertically center
    alignItems: "center", // Horizontally center
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  noteHeader: {
    fontSize: 18,
    color: "#FFFFFF",
    flexShrink: 1, // Allow the text to shrink if required
  },
  deleteText: {
    color: "white",
  },
  noteInnerContainer: {
    flexDirection: "col",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastModifiedText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  buttonDisabled: {
    backgroundColor: "#777777", // Light gray color to indicate disabled
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    opacity: 0.2,
  },
  formattingButtonsContainer: {
    flexDirection: "row", // To layout the buttons in a single row
    justifyContent: "space-around", // To evenly space the buttons
    margin: 10,
  },
});

export default styles;
