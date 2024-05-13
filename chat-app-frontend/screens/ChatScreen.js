import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TouchableOpacity,
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

const Chat = ({ navigation, route }) => {
  const messageCtx = useContext(MessageContext);
  const userctx = useContext(LoginContext);
  const alertCtx = useAlert();
  const flatListRef = useRef();
  const [highlightedMsgId, setHighlightedMsgId] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [searchIsOn, setSearchIsOn] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const replyToMessage = replyTo
    ? messageCtx.messages
        .filter((item) => item.id === route.params.id)?.[0]
        .messages.filter((item) => item._id === replyTo)[0]
    : null;

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
    // console.log(msgid);
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
  const deleteMessageConfirmHandler = () => {};

  const searchUpDownHandler = (direction) => {
    if (direction === "down") {
      setSearchIndex((prev) => {
        let newInd = prev - 1;
        if (prev === 0) newInd = searchResults.length - 1;
        scrollToHandler(searchResults[newInd]);
        return newInd;
      });
    } else {
      setSearchIndex((prev) => {
        let newInd = prev + 1;
        if (prev === searchResults.length - 1) newInd = 0;
        scrollToHandler(searchResults[newInd]);
        return newInd;
      });
    }
  };

  useEffect(() => {
    if (search.length === 0) return;
    let results = msgdata.filter((item) =>
      item.message.toLowerCase().includes(search.toLowerCase())
    );
    results = results.map((item) => item._id);
    console.log("res", results);
    if (results.length === 0) return;
    scrollToHandler(results[0]);
    setSearchIndex(0);
    setSearchResults(results);
  }, [search]);

  const handleTitlePress = () => {
    navigation.navigate("ChatUserProfile", {
      name: route?.params?.name,
      id: route?.params?.id,
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={handleTitlePress}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
            {route.params.name}
          </Text>
        </TouchableOpacity>
      ),
    });
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
        <View style={{ padding: 15 }}>
          <IconIonicons
            name="search"
            size={25}
            color="black"
            onPress={() => setSearchIsOn((prev) => !prev)}
          />
        </View>
      ),
    });
  }, [navigation, highlightedMsgId]);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {searchIsOn && (
          <View style={styles.searchContainer}>
            <View style={styles.searchContainer1}>
              <TextInput
                placeholder="Search"
                style={styles.searchInput}
                value={search}
                onChangeText={(text) => setSearch(text)}
              />
              <View style={styles.searchCloseIcon}>
                <IconIonicons
                  name="close"
                  size={30}
                  onPress={() => setSearchIsOn(false)}
                />
              </View>
            </View>
            <View style={styles.searchContainer2}>
              {/* <View> */}
              <Text>
                {searchResults.length > 0 ? searchIndex + 1 : 0} of{" "}
                {searchResults.length}
              </Text>
              <View style={styles.searchUpDownIcon}>
                <IconEntypo
                  name="chevron-up"
                  size={20}
                  onPress={() => searchUpDownHandler("up")}
                />
                <IconEntypo
                  name="chevron-down"
                  size={20}
                  onPress={() => searchUpDownHandler("down")}
                />
              </View>
              {/* </View> */}
            </View>
          </View>
        )}
        <View style={styles.innerContainer1}>
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
          <View style={styles.innerContainer2}>
            <View style={styles.innerContainer3}>
              <View style={styles.innerContainer4}>
                <View style={styles.innerContainer5}>
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
              <Text style={[styles.text, { fontSize: 10 }]}>
                {replyToMessage?.from === userid ? "You" : route?.params?.name}
              </Text>
              <Text style={[styles.text, { fontSize: 10 }]}>
                {replyToMessage?.message.trim().substring(0, 40)}
              </Text>
            </View>
          </View>
        )}
        <View style={styles.bottomContainer}>
          <View style={styles.bottomInnerContainer1}>
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
          <View style={styles.bottomInnerContainer2}>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer1: { flex: 1, justifyContent: "center" },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBlockColor: "grey",
  },
  searchContainer1: {
    display: "flex",
    flexDirection: "row",
  },
  searchContainer2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 5,
  },
  searchCloseIcon: {
    display: "flex",
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "85%",
  },
  searchUpDownIcon: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  innerContainer2: { padding: 5, width: "100%" },
  innerContainer3: {
    padding: 10,
    backgroundColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderRadius: 5,
    paddingHorizontal: 2,
  },
  innerContainer4: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  innerContainer5: { display: "flex", flexDirection: "row" },
  text: { color: "grey", paddingLeft: 5 },
  bottomContainer: { flexDirection: "row", height: 70 },
  bottomInnerContainer1: {
    flex: 6,
    borderWidth: 1,
    borderRadius: 50,
    margin: 10,
    marginRight: 0,
  },
  bottomInnerContainer2: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    paddingLeft: 0,
  },
});
