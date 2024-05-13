import { View, ScrollView, StyleSheet } from "react-native";
import React, { useContext } from "react";
import OnlineUserContext from "../store/OnlineUserContext";

import User from "../components/UserScreenComponent";
// import Contacts from "../components/Contacts";

const UsersScreen = ({ navigation }) => {
  const onlineUserCtx = useContext(OnlineUserContext);
  const data = onlineUserCtx.onlineUsers;

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {data.map((item, index) => {
          return (
            <User
              key={item._id}
              navigation={navigation}
              data={item}
              index={index}
            />
          );
        })}
      </View>
      {/* <Contacts /> */}
    </ScrollView>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
