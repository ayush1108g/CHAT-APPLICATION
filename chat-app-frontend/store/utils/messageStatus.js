import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Doublecheck from "../../components/doublecheck";
const messageStatus = ({ status }) => {
  const msgseenStatus =
    status === "sent" ? (
      <Icon name="check" />
    ) : status === "delivered" ? (
      <Doublecheck />
    ) : status === "seen" ? (
      <Doublecheck color={"blue"} />
    ) : status === "sending" ? (
      <Icon name="clockcircleo" />
    ) : (
      <Icon2 name="error" color="red" />
    );
  return <View style={styles.container}>{msgseenStatus}</View>;
};

export default messageStatus;

const styles = StyleSheet.create({
  container: {
    paddingRight: 5,
  },
});
