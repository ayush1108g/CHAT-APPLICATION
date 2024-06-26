import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useContext, useEffect } from "react";

import LoginContext from "../store/AuthContext";
import SocketContext from "../store/SocketContext";
import MessageStatus from "../store/utils/messageStatus";
import { DataContext } from "../store/DataContext";

import { CheckBox } from "react-native-elements";

const ListComponent = ({ navigation, item, selectedId, setSelectedId }) => {
  const dataCtx = useContext(DataContext);
  const loginctx = useContext(LoginContext);
  const socketCtx = useContext(SocketContext);

  const forwarding = dataCtx.forwarding;
  const setForwarding = dataCtx.setForwarding;

  useEffect(() => {
    item.messages.forEach((msg) => {
      if (
        msg.from !== loginctx?.userid &&
        msg.status !== "seen" &&
        msg.status !== "delivered"
      ) {
        socketCtx.updateMessageStatusHandler(msg._id, "delivered");
      }
    });
  }, []);
  const data = item?.user;
  let count = 0;
  item.messages.forEach((msg) => {
    if (msg.from !== loginctx?.userid && msg.status !== "seen") {
      count++;
    }
  });
  const lastmsg = item?.messages[0];
  const ctlen = lastmsg?.length || 0;
  const lt = new Date(item.messages[0]?.timeStamp);
  const lasttime = lt.toLocaleString("en-US", {
    day: "numeric",
    month: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const isSelected = selectedId.includes(data._id);
  const SeletedHandler = () => {
    if (isSelected) {
      setSelectedId((prev) => prev.filter((id) => id !== data._id));
    } else {
      setSelectedId((prev) => [...prev, data._id]);
    }
  };

  const setForwardingHandler = (data) => {
    setForwarding(data);
  };
  return (
    <View
      style={[
        styles.container1st,
        // { backgroundColor: isSelected ? "grey" : "" },
      ]}
    >
      <Pressable
        onLongPress={() => {
          SeletedHandler();
        }}
        style={({ pressed }) => [{ flex: 1 }]}
        onPress={() => {
          if (selectedId.length === 0) {
            navigation.navigate("Chat", {
              name: data?.name || "NAN",
              id: data?._id,
            });
          } else {
            SeletedHandler();
          }
        }}
      >
        <View style={styles.containermain}>
          <View style={styles.imagecontainer}>
            <Image
              style={styles.tinyLogo}
              source={{ uri: data?.image || data?.profile }}
            />
          </View>
          <View style={styles.textcontainer}>
            <View style={styles.innertextcontainer}>
              <Text>{data?.name + " " + data?._id.substring(20)}</Text>
              <Text>{lasttime}</Text>
            </View>
            <View style={styles.innertextcontainer2}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.innertextcontainer3}>
                  {lastmsg.from !== data?._id && (
                    <MessageStatus status={lastmsg?.status} />
                  )}
                </View>
                <Text>
                  {lastmsg?.message?.trim().substring(0, 40)}
                  {ctlen > 40 && " ...."}
                </Text>
              </View>
              {count !== 0 && (
                <View style={styles.innertextcontainer4}>
                  <View style={styles.unreadMessages}>
                    <Text>{count}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          {forwarding?.length > 0 && (
            <View>
              <CheckBox
                // title=" "
                checked={isSelected}
                onPress={() => SeletedHandler()}
              />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default ListComponent;

const styles = StyleSheet.create({
  container1st: {
    flex: 1,
    borderWidth: 0.1,
    borderRadius: 5,
  },
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
    justifyContent: "space-between",
  },
  innertextcontainer3: {
    flexDirection: "column",
    justifyContent: "center",
  },
  innertextcontainer4: {
    minWidth: 40,
  },
  unreadMessages: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
    borderRadius: 25,
    padding: 2,
    paddingHorizontal: 10,
  },
});
