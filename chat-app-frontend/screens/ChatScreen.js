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
  Alert,
} from "react-native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";

import { useContext } from "react";
import { useAlert } from "../store/AlertContext";
import MessageContext from "../store/MessageContext";
import LoginContext from "../store/AuthContext";
import MessageRow from "../components/Message";
// import { copyTextToClipboard } from "../store/utils/CopyToClipboard";
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

const Chat = ({ navigation, route }) => {
  const messageCtx = useContext(MessageContext);
  const userctx = useContext(LoginContext);
  const alertCtx = useAlert();
  const flatListRef = useRef();
  const [highlightedMsgId, setHighlightedMsgId] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const handleRestart = () => {
    messageCtx.refreshMessages();
  };

  const replyToMessage = replyTo
    ? messageCtx.messages
        .filter((item) => item.id === route.params.id)?.[0]
        .messages.filter((item) => item._id === replyTo)[0]
    : null;
  console.log(replyToMessage);
  // const copyMessageContent = () => {
  //   console.log("copying");
  //   console.log(highlightedMsgId);
  //   const msg = messageCtx?.messages
  //     .filter((item) => item.id === route.params.id)?.[0]
  //     .messages.filter((item) => item._id === highlightedMsgId[0])[0].message;
  //   copyTextToClipboard(msg);
  // };

  const userid = userctx.userid;
  const data = messageCtx.messages.filter(
    (item) => item.id === route.params.id
  );

  const msgdata = data[0]?.messages;

  const [message, setMessage] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const messageHandler = () => {
    if (message.length <= 0) return;
    messageCtx.sendMessage(message, route.params.id, replyToMessage?._id);
    dismissKeyboard();
    setReplyTo(null);
    setHighlightedMsgId([]);
    setMessage("");
  };
  const scrollToHandler = (msgid) => {
    // scroll to id in flatlist
    console.log(msgid);

    const index = msgdata.findIndex((item) => item._id === msgid);
    // console.log(index);
    flatListRef?.current?.scrollToIndex({ index: index });
    let temp = [...highlightedMsgId];
    setHighlightedMsgId((prev) => [...prev, msgid]);

    setTimeout(() => {
      setHighlightedMsgId(temp);
    }, 1500);
  };

  // const deleteMessageConfirmHandler = () => {
  //   const time = new Date().getTime();
  //   const canDeleteForEveryone = highlightedMsgId.every((id) => {
  //     const message = messageCtx.messages
  //       .find((item) => item.id === route.params.id)
  //       ?.messages.find((item) => item._id === id);

  //     if (!message) {
  //       return false;
  //     }
  //     console.log(message);
  //     const messageTimestamp =
  //       new Date(message.timeStamp).getTime() + 24 * 60 * 60 * 1000;
  //     const twentyFourHoursLater = new Date().getTime();

  //     return messageTimestamp > twentyFourHoursLater;
  //   });

  //   console.log(canDeleteForEveryone);

  //   Alert.alert(
  //     "Delete Message",
  //     "Please select one of the following options:",
  //     [
  //       { text: "Cancel", onPress: () => console.log("Cancel Pressed") },
  //       {
  //         text: "Delete for me",
  //         onPress: () => handleOptionSelected("Option 2"),
  //       },
  //       canDeleteForEveryone && {
  //         text: "Delete for everyone",
  //         onPress: () => handleOptionSelected("Option 3"),
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };
  // const deleteMessage = (ids) => {};

  useLayoutEffect(() => {
    if (highlightedMsgId.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ padding: 5, flexDirection: "row" }}>
            <View style={{ paddingHorizontal: 15 }}>
              <IconMaterial
                name="close"
                size={25}
                color="black"
                onPress={() => setHighlightedMsgId([])}
              />
            </View>
            {highlightedMsgId.length === 1 && (
              <>
                {/* <View style={{ paddingHorizontal: 15 }}>
                  <IconMaterial
                    name="content-copy"
                    size={25}
                    color="black"
                    onPress={() => copyMessageContent()}
                  />
                </View> */}
                <View style={{ paddingHorizontal: 15 }}>
                  <IconMaterial
                    name="reply"
                    size={25}
                    color="black"
                    onPress={() => setReplyTo(highlightedMsgId[0])}
                  />
                </View>
              </>
            )}
            <View style={{ paddingHorizontal: 15 }}>
              <IconMaterial
                name="delete"
                size={25}
                color="black"
                onPress={() => deleteMessageConfirmHandler()}
              />
            </View>
          </View>
        ),
      });
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={{ padding: 5 }}>
          <IconMaterial
            name="restart"
            size={25}
            color="black"
            onPress={handleRestart}
          />
        </View>
      ),
    });
  }, [navigation, highlightedMsgId]);

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <FlatList
            ref={flatListRef}
            data={msgdata}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => (
              <MessageRow
                data={item}
                allData={msgdata}
                userid={userid}
                name={route.params.name}
                scrollToHandler={scrollToHandler}
                highlighted={highlightedMsgId}
                setHighlightedMsg={setHighlightedMsgId}
                index={index}
              />
            )}
            inverted
          />
        </View>
        {replyTo && (
          <View style={{ padding: 5, width: "100%" }}>
            <View
              style={{
                padding: 10,
                backgroundColor: "#F0F0F0",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 3,
                borderRadius: 5,
                paddingHorizontal: 2,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <IconMaterial
                    name="reply"
                    size={15}
                    color="black"
                    onPress={() => setHighlightedMsgId([])}
                  />
                  <Text>Replying to</Text>
                </View>
                <Pressable
                  onPress={() => {
                    setReplyTo(null);
                  }}
                >
                  <IconEntypo name="cross" size={20} />
                </Pressable>
              </View>
              <Text style={{ color: "grey", paddingLeft: 5, fontSize: 10 }}>
                {replyToMessage?.from === userid ? "You" : route?.params?.name}
              </Text>
              <Text style={{ color: "grey", paddingLeft: 5, fontSize: 14 }}>
                {replyToMessage?.message.trim().substring(0, 40)}
              </Text>
            </View>
          </View>
        )}
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
              <IconIonicons name="send-sharp" size={30} />
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Chat;

const styles = StyleSheet.create({});
