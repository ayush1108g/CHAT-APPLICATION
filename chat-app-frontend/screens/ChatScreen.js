import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  Animated,
  TouchableOpacity,
  FlatList,
  Pressable,
  Alert,
  Easing,
  ImageBackground,
  Image,
} from "react-native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconMaterial from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconFeather from "react-native-vector-icons/Feather";
import IconAntDesign from "react-native-vector-icons/AntDesign";

import { useContext } from "react";
import { useAlert } from "../store/AlertContext";

import MessageContext from "../store/MessageContext";
import LoginContext from "../store/AuthContext";
import { DataContext } from "../store/DataContext";

import MessageRow from "../components/Message";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

const Chat = ({ navigation, route }) => {
  const messageCtx = useContext(MessageContext);
  const userctx = useContext(LoginContext);
  const alertCtx = useAlert();
  const dataCtx = useContext(DataContext);
  const flatListRef = useRef();
  const [highlightedMsg, sethighlightedMsg] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [searchIsOn, setSearchIsOn] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [textInputHeight, setTextInputHeight] = useState(70); // Initial height

  const [isAtBottom, setIsAtBottom] = useState(true); // Assume initially at bottom
  const [message, setMessage] = useState("");

  const translateY = useRef(new Animated.Value(-100)).current; // Start with position off-screen
  const forwarding = dataCtx.forwarding;
  const setForwarding = dataCtx.setForwarding;

  const replyToMessage = replyTo
    ? messageCtx.messages
        .filter((item) => item.id === route.params.id)?.[0]
        .messages.filter((item) => item._id === replyTo._id)[0]
    : null;

  const userid = userctx.userid;
  const data = messageCtx.messages.filter(
    (item) => item.id === route.params.id
  );

  const msgdata = data[0]?.messages;

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const isScrolledToBottom = !(contentOffset.y > 100);
    setIsAtBottom(isScrolledToBottom);
  };

  const scrollToBottom = () => {
    flatListRef.current.scrollToIndex({ index: 0, animated: true });
    setIsAtBottom(true);
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const messageHandler = () => {
    if (message.length <= 0) return;
    messageCtx.sendMessage(message, route.params.id, replyToMessage?._id);
    dismissKeyboard();
    setReplyTo(null);
    sethighlightedMsg([]);
    setMessage("");
  };
  const scrollToHandler = (msgid) => {
    // scroll to id in flatlist
    // console.log(msgid);
    const index = msgdata.findIndex((item) => item._id === msgid);
    // console.log(index);
    if (index === -1) return;
    flatListRef?.current?.scrollToIndex({ index: index });
    let temp = [...highlightedMsg];
    sethighlightedMsg((prev) => [...prev, msgdata[index]]);

    setTimeout(() => {
      sethighlightedMsg(temp);
    }, 1500);
  };

  // const deleteMessageConfirmHandler = () => {
  //   const time = new Date().getTime();
  //   const canDeleteForEveryone = highlightedMsg.every((id) => {
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

  const messageForwardHandler = () => {
    if (highlightedMsg.length === 0) return;
    setForwarding(highlightedMsg);
    navigation.navigate("Home", { forward: true });
  };
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

  const DocSelectHandler = () => {};
  const CameraSelectHandler = () => {
    navigation.navigate("Camera");
  };

  useEffect(() => {
    // Animate in/out based on searchIsOn state
    if (searchIsOn) {
      // Slide in from top
      Animated.timing(translateY, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out to top
      Animated.timing(translateY, {
        toValue: -100,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [searchIsOn]);

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
    if (highlightedMsg.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ padding: 5, flexDirection: "row" }}>
            <View style={{ paddingHorizontal: 15 }}>
              <IconMaterial
                name="close"
                size={25}
                color="black"
                onPress={() => sethighlightedMsg([])}
              />
            </View>
            {highlightedMsg.length === 1 && (
              <>
                <View style={{ paddingHorizontal: 15 }}>
                  <IconMaterial
                    name="reply"
                    size={25}
                    color="black"
                    onPress={() => setReplyTo(highlightedMsg[0])}
                  />
                </View>
              </>
            )}
            <View style={{ paddingHorizontal: 15 }}>
              <IconEntypo
                name="forward"
                size={25}
                color="black"
                onPress={() => messageForwardHandler()}
              />
            </View>
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
        <View style={{ flexDirection: "row" }}>
          <View style={{ padding: 15 }}>
            <Menu>
              <MenuTrigger>
                <IconIonicons
                  name="ellipsis-vertical"
                  size={25}
                  color="black"
                />
              </MenuTrigger>

              <MenuOptions>
                <MenuOption onSelect={() => setSearchIsOn((prev) => !prev)}>
                  <View
                    style={{
                      padding: 5,
                      paddingBottom: 0,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <IconIonicons name="search" size={25} color="black" />
                    <Text>Search</Text>
                  </View>
                </MenuOption>
                <MenuOption
                  onSelect={() => navigation.navigate("Change Background")}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Image
                      source={require("../assets/changebg.jpg")}
                      style={{ width: 35, height: 35 }}
                    />
                    <Text>Change Background</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>

        // ellipsis-vertical
      ),
    });
  }, [navigation, highlightedMsg]);

  return (
    <ImageBackground source={dataCtx.background} style={styles.background}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {searchIsOn && (
            <Animated.View
              style={[styles.searchContainer, { transform: [{ translateY }] }]}
            >
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
            </Animated.View>
          )}
          <View style={styles.innerContainer1}>
            <FlatList
              ref={flatListRef}
              data={msgdata}
              keyExtractor={(item, index) => item._id + index}
              onScroll={handleScroll}
              renderItem={({ item, index }) => (
                <MessageRow
                  index={index}
                  data={item}
                  allData={msgdata}
                  userid={userid}
                  name={route.params.name}
                  highlighted={highlightedMsg}
                  setReplyTo={setReplyTo}
                  scrollToHandler={scrollToHandler}
                  setHighlightedMsg={sethighlightedMsg}
                />
              )}
              inverted
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                });
              }}
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
                      onPress={() => sethighlightedMsg([])}
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
                  {replyToMessage?.from === userid
                    ? "You"
                    : route?.params?.name}
                </Text>
                <Text style={[styles.text, { fontSize: 10 }]}>
                  {replyToMessage?.message.trim().substring(0, 40)}
                </Text>
              </View>
            </View>
          )}
          <View
            style={[
              styles.bottomContainer,
              {
                height: Math.max(70, textInputHeight),
              },
            ]}
          >
            <View style={[styles.bottomInnerContainer1]}>
              <TextInput
                multiline
                numberOfLines={10}
                maxLength={1000}
                style={[
                  {
                    padding: 10,
                    width: message.length < 1 ? "75%" : "95%",
                  },
                ]}
                placeholder="Write message here "
                value={message}
                onChangeText={(text) => setMessage(text)}
                onContentSizeChange={(e) =>
                  setTextInputHeight(e.nativeEvent.contentSize.height + 20)
                }
              />
              {message.length < 1 && (
                <View style={styles.bottomInnerContainer1Icon}>
                  <IconFeather
                    name="paperclip"
                    size={25}
                    onPress={DocSelectHandler}
                  />
                  <IconFeather
                    name="camera"
                    size={25}
                    onPress={CameraSelectHandler}
                  />
                </View>
              )}
            </View>
            <View style={styles.bottomInnerContainer2}>
              <TouchableOpacity onPress={messageHandler}>
                <IconIonicons name="send-sharp" size={30} color={"#808080"} />
              </TouchableOpacity>
            </View>
          </View>
          {!isAtBottom && (
            <TouchableOpacity
              style={styles.scrollToBottomButton}
              onPress={scrollToBottom}
            >
              <IconAntDesign name="downcircleo" size={25} color={"grey"} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
};

export default Chat;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    // justifyContent: "center",
  },
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
    backgroundColor: "#F0F0F0",
    paddingLeft: 10,
    flex: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 15,
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
  bottomInnerContainer1Icon: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "20%",
  },
  scrollToBottomButton: {
    position: "absolute",
    bottom: 65,
    right: 25,
    // backgroundColor: "#F0F0F0",
    // padding: 10,
    // borderRadius: 5,
  },
  scrollToBottomText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
