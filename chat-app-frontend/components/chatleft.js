import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Doublecheck from "./doublecheck";
const chat = ({ data }) => {
  // const msgseenStatus =
  //   data.msgstatus === "sent" ? (
  //     <Icon name="check" />
  //   ) : data.msgstatus === "delivered" ? (
  //     <Doublecheck />
  //   ) : data.msgstatus === "seen" ? (
  //     <Doublecheck color={"blue"} />
  //   ) : data.msgstatus === "sending" ? (
  //     <Icon name="clockcircleo" />
  //   ) : (
  //     <Icon2 name="error" color="red" />
  //   );
  const msgseenStatus = <Doublecheck />;
  const time = new Date(data.timeStamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <View
      style={{
        maxWidth: "85%",
        paddingLeft: 15,
        flexWrap: "wrap",
        margin: 5,
      }}
    >
      <View
        style={{
          backgroundColor: "grey",
          padding: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
        }}
      >
        <View>
          <Text style={{}}>{data.message}</Text>
        </View>
        <View
          style={{
            position: "relative",
            right: -20,
            bottom: -5,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              alignSelf: "flex-end",
            }}
          >
            {time}&nbsp;&nbsp;
            {/* {msgseenStatus} */}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default chat;

const styles = StyleSheet.create({});
