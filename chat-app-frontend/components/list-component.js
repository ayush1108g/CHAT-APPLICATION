import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Doublecheck from "./doublecheck";
const ListComponent = ({ navigation, item }) => {
  const data = item.user;
  const lastmsg = item.messages[0].message;
  const ctlen = lastmsg?.length || 0;
  const lt = new Date(item.messages[0].timeStamp);
  const lasttime = lt.toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // const msgseenstatus =
  //   data?.msgstatus === "sent" ? (
  //     <Icon name="check" />
  //   ) : data?.msgstatus === "delivered" ? (
  //     <Doublecheck />
  //   ) : data?.msgstatus === "seen" ? (
  //     <Doublecheck color={"blue"} />
  //   ) : data?.msgstatus === "sending" ? (
  //     <Icon name="clockcircleo" />
  //   ) : (
  //     <Icon2 name="error" color="red" />
  //   );
  const msgseenstatus = <Doublecheck />;

  return (
    <View style={{ flex: 1, borderWidth: 0.1, borderRadius: 2 }}>
      <Pressable
        style={({ pressed }) => []}
        android_ripple={{ color: "grey" }}
        onPress={() => {
          navigation.navigate("Chat", { name: data.name, id: data._id });
        }}
      >
        <View style={styles.containermain}>
          <View style={styles.imagecontainer}>
            <Image
              style={styles.tinyLogo}
              source={{
                uri: data?.image || data?.profile,
              }}
            />
          </View>
          <View style={styles.textcontainer}>
            <View style={styles.innertextcontainer}>
              <Text>{data.name}</Text>
              <Text>{lasttime}</Text>
            </View>
            <View style={styles.innertextcontainer2}>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {msgseenstatus}
              </View>
              <Text>
                {lastmsg?.trim().substring(0, 40)}
                {ctlen > 40 && " ...."}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ListComponent;

const styles = StyleSheet.create({
  containermain: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    height: 65,
  },
  imagecontainer: {
    padding: 5,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textcontainer: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
  },
  innertextcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innertextcontainer2: {
    flexDirection: "row",
  },
});
