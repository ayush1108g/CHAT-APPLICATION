import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  Animated,
  Pressable,
} from "react-native";
import React, { useRef, useState, useContext } from "react";
import LoginContext from "../store/AuthContext";
import MessageStatus from "../store/utils/messageStatus";
const chat = ({
  data,
  allData,
  name,
  scrollToHandler,
  setHighlightedMsg,
  highlighted,
}) => {
  const userctx = useContext(LoginContext);
  const [readMore, setReadMore] = useState(false);

  const replyTo = data.replyto;
  const replyToMessage = replyTo
    ? allData.find((msg) => msg?._id === replyTo)
    : null;
  const time = new Date(data.timeStamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const pressedHandler = () => {
    scrollToHandler(replyToMessage?._id);
  };

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      // onMoveShouldSetPanResponder: () => true,
      // onPanResponderMove: Animated.event([null, { dx: pan.x }], {
      //   useNativeDriver: false,
      // }),
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Determine if the gesture is primarily horizontal (for swiping)
        return (
          Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
          Math.abs(gesture.dx) > 5
        );
      },
      onPanResponderMove: (_, gesture) => {
        // Update x value for horizontal movement
        pan.x.setValue(gesture.dx);
      },
      onPanResponderRelease: (e, gesture) => {
        console.log(gesture.dx);
        if (gesture.dx < -60) {
          // Swipe left far enough to trigger delete action
          // onDelete();
          setHighlightedMsg((prev) => [...prev, data?._id]);
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        } else {
          // Reset to initial position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: pan.x }] }]}
      {...panResponder.panHandlers}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (highlighted && highlighted.includes(data?._id)) {
            setHighlightedMsg(highlighted.filter((id) => id !== data?._id));
          }
        }}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer1}>
            <View style={styles.innerContainer2}>
              {replyTo && (
                <TouchableWithoutFeedback onPress={pressedHandler}>
                  <View style={styles.innerContainer3}>
                    <Text style={styles.nameText}>
                      {replyToMessage?.from === userctx.userid ? "You" : name}
                    </Text>
                    <Text style={styles.msgText}>
                      {replyToMessage?.message.trim().substring(0, 40)}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}

              {data.message.length >= 500 && !readMore ? (
                <View>
                  <Text style={{}} selectable={true}>
                    {data.message.trim().substring(0, 500)}
                  </Text>
                  <Pressable onPress={() => setReadMore(true)}>
                    <View style={styles.ReadMoreContainer}>
                      <Text style={{ color: "#1E0342" }}>...Read More</Text>
                    </View>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <Text style={{}} selectable={true}>
                    {data.message.trim()}
                  </Text>
                </View>
              )}
              <View style={styles.bottomContainer}>
                <View>
                  <Text style={{ fontSize: 10 }}>{time}&nbsp;&nbsp;</Text>
                </View>
                <View>
                  <MessageStatus status={data?.status} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default chat;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 5,
    width: "100%",
  },
  innerContainer1: {
    maxWidth: "85%",
    paddingRight: 15,
    flexWrap: "wrap",
    alignSelf: "flex-end",
    margin: 5,
  },
  innerContainer2: {
    backgroundColor: "cyan",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  innerContainer3: {
    position: "relative",
    left: -10,
    top: -2,
    backgroundColor: "#00dfff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderRadius: 5,
    paddingHorizontal: 2,
  },
  nameText: { color: "#2f4f4f", paddingLeft: 5, fontSize: 10 },
  msgText: { color: "#2f4f4f", paddingLeft: 5, fontSize: 14 },
  ReadMoreContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  bottomContainer: {
    position: "relative",
    right: -20,
    bottom: -2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
