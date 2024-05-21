import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Animated,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import React, { useRef, useState, useContext, useEffect } from "react";

import LoginContext from "../store/AuthContext";
import SocketContext from "../store/SocketContext";

import IconEntypo from "react-native-vector-icons/Entypo";

const chatLeft = ({
  data,
  allData,
  name,
  highlighted,
  setReplyTo,
  scrollToHandler,
  setHighlightedMsg,
}) => {
  const userctx = useContext(LoginContext);
  const socketCtx = useContext(SocketContext);
  const [readMore, setReadMore] = useState(false);
  const replyTo = data.replyto;
  const replyToMessage = replyTo
    ? allData.find((msg) => msg._id === replyTo)
    : null;

  const time = new Date(data.timeStamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const pressedHandler = () => {
    scrollToHandler(replyToMessage?._id);
  };

  useEffect(() => {
    if (data.status !== "seen") {
      console.log("data not seen !!!", data?.message);
      // const id = data?._id.includes("+") ? data?._id.split("+")[0] : data?._id;
      // const forwarded = data?._id.includes("+") ? true : false;
      const id = data?._id;
      socketCtx.updateMessageStatusHandler(id, "seen");
    }
  }, []);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Determine if the gesture is primarily horizontal (for swiping)
        return (
          Math.abs(gesture.dx) > Math.abs(gesture.dy) &&
          Math.abs(gesture.dx) > 10
        );
      },
      onPanResponderMove: (_, gesture) => {
        // Update x value for horizontal movement
        pan.x.setValue(gesture.dx);
      },
      onPanResponderRelease: (e, gesture) => {
        console.log(gesture.dx);
        if (gesture.dx < -30) {
          // Swipe left far enough to trigger delete action
          setHighlightedMsg((prev) => [...prev, data]);
        } else if (gesture.dx > 100) {
          console.log(data._id);
          setReplyTo(data);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
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
          if (highlighted && highlighted.includes(data)) {
            setHighlightedMsg(highlighted.filter((indata) => indata !== data));
          }
        }}
      >
        <View style={styles.container}>
          <View style={styles.triangularContainer}>
            <View
              style={[styles.triangle, { bottom: data?.forward && -19.5 }]}
            />
          </View>
          {data?.forward && (
            <View style={{ flexDirection: "row", alignContent: "center" }}>
              <View style={{ justifyContent: "center" }}>
                <IconEntypo name="forward" size={15} color="pink" />
              </View>
              <Text style={{ color: "pink" }}>Forwarded</Text>
            </View>
          )}
          <View style={styles.innerContainer1}>
            {replyTo && (
              <TouchableWithoutFeedback onPress={pressedHandler}>
                <View style={styles.innerContainer2}>
                  <Text style={styles.nameText}>
                    {replyToMessage?.from === userctx.userid ? "You" : name}
                  </Text>
                  <Text style={styles.msgText}>
                    {replyToMessage?.message?.trim().substring(0, 40)}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            <View>
              {data?.message?.length >= 500 && !readMore ? (
                <View>
                  <Text style={{}} selectable={true}>
                    {data?.message?.trim().substring(0, 500)}
                  </Text>
                  <Pressable onPress={() => setReadMore(true)}>
                    <View style={styles.ReadMoreContainer}>
                      <Text style={styles.ReadMore}>...Read More</Text>
                    </View>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <Text style={{}} selectable={true}>
                    {data?.message?.trim()}
                  </Text>
                </View>
              )}
              <View style={styles.bottomContainer}>
                <Text style={styles.TimeDisplay}>{time}&nbsp;&nbsp;</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default chatLeft;

const styles = StyleSheet.create({
  container: {
    maxWidth: "85%",
    paddingLeft: 5,
    flexWrap: "wrap",
    margin: 2,
  },
  triangularContainer: {
    height: 0,
    display: "flex",
    justifyContent: "flex-statt",
    alignItems: "flex-start",
  },
  triangle: {
    position: "relative",
    left: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderTopWidth: 30,
    borderLeftColor: "transparent",
    borderTopColor: "grey",
  },
  innerContainer1: {
    backgroundColor: "grey",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  innerContainer2: {
    position: "relative",
    left: -10,
    top: -2,
    backgroundColor: "#818589",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    borderRadius: 5,
    paddingHorizontal: 2,
  },
  nameText: { color: "#C0C0C0", paddingLeft: 5, fontSize: 10 },
  msgText: { color: "#C0C0C0", paddingLeft: 5, fontSize: 14 },
  ReadMoreContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  ReadMore: { color: "pink" },
  bottomContainer: {
    position: "relative",
    right: -20,
    bottom: -5,
  },
  TimeDisplay: {
    fontSize: 10,
    alignSelf: "flex-end",
  },
});
