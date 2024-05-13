import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import OnlineUserContext from "../store/OnlineUserContext";

const ChatUserProfile = ({ route }) => {
  const onlineUserCtx = useContext(OnlineUserContext);
  const data = onlineUserCtx.onlineUsers;
  console.log(data);
  const currentUser = data.find((item) => item._id === route?.params?.id);
  console.log(currentUser);
  return (
    <View style={styles.mainContainer}>
      <View>
        <Image
          source={{ uri: currentUser?.image }}
          alt="image"
          style={{ width: 200, height: 200, borderRadius: 100 }}
        />
      </View>
      <View style={styles.innerCont2}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {currentUser?.name}
        </Text>
        <Text>{currentUser?.online ? "ONLINE" : "OFFLINE"}</Text>
        <Text>{currentUser?.lastonline}</Text>
      </View>
    </View>
  );
};

export default ChatUserProfile;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 25,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  innerCont2: {
    padding: 10,
    alignItems: "center",
  },
});
