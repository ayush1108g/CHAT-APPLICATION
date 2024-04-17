import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import React from "react";

const DoubleCheck = ({ color }) => {
  return (
    <View style={styles.container}>
      <Icon
        name="check"
        color={color ? color : "black"}
        style={styles.checkIcon}
      />
      <Icon
        name="check"
        color={color ? color : "black"}
        style={[styles.checkIcon, styles.secondCheckIcon]}
      />
    </View>
  );
};

export default DoubleCheck;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    // fontSize: 24,
  },
  secondCheckIcon: {
    marginLeft: -4,
    position: "absolute",
  },
});
