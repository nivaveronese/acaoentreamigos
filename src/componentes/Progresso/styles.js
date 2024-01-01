import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    height: 35,
    backgroundColor: '#1E8187',
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  value: {
      color: '#FFFFFF',
      marginRight: 7,
  },
  tracker: {
    flex: 1,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  progress: {
      height: 3,
      backgroundColor: '#8257E5',
  },
  texto: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: "bold",
    fontFamily: 'roboto'
  },
});