import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Pressable,
} from "react-native";

import ChatleftComponent from "../components/chatleft";
import ChatRightComponent from "../components/chatright";
import { useContext } from "react";
import MessageContext from "../store/MessageContext";
import LoginContext from "../store/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

// const data = [
//   {
//     id: Math.random() * 100,
//     from: "abcd",
//     to: "abc",
//     msg: "Hi I am Ayush",
//     time: 26172567894,
//     msgstatus: "seen",
//   },
//   {
//     id: Math.random() * 100,
//     from: "abc",
//     to: "abcd",
//     msg: "Hi i Am Shrish Can u tell why you messaged me ⭐",
//     time: 1734,
//     msgstatus: "sent",
//   },
//   {
//     id: Math.random() * 100,
//     from: "abc",
//     to: "abcd",
//     msg: "hi",
//     // time: new Date().getTime(),
//     time: 71111,
//     msgstatus: "sent",
//   },
// ];

const MessageRow = ({ data, userid }) => {
  return data.from === userid ? (
    <ChatRightComponent key={data._id} data={data} />
  ) : (
    <ChatleftComponent key={data._id} data={data} />
  );
};

const Chat = ({ navigation, route }) => {
  const messageCtx = useContext(MessageContext);
  const userctx = useContext(LoginContext);

  const handleRestart = () => {
    messageCtx.refreshMessages();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ padding: 5 }}>
          <Icon2
            name="restart"
            size={25}
            color="black"
            onPress={handleRestart}
          />
        </View>
      ),
    });
  }, [navigation]);

  const userid = userctx.userid;
  const data = messageCtx.messages.filter(
    (item) => item.id === route.params.id
  );

  const msgdata = data[0]?.messages;

  const [message, setMessage] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const messageHandler = () => {
    if (message.length <= 0) return;
    messageCtx.sendMessage(message, route.params.id);
    dismissKeyboard();
    setMessage("");
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <FlatList
            data={msgdata}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <MessageRow data={item} userid={userid} />
            )}
            inverted
          />
        </View>
        <View style={{ flexDirection: "row", height: 70 }}>
          <View
            style={{
              flex: 6,
              borderWidth: 1,
              borderRadius: 50,
              margin: 10,
              marginRight: 0,
            }}
          >
            <TextInput
              multiline
              numberOfLines={4}
              maxLength={1000}
              style={{ padding: 10 }}
              placeholder="     message"
              value={message}
              onChangeText={(text) => setMessage(text)}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
              paddingLeft: 0,
            }}
          >
            <Pressable
              onPress={messageHandler}
              android_ripple={{ color: "grey" }}
            >
              <Icon name="send-sharp" size={30} />
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Chat;

const styles = StyleSheet.create({});
