import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import React, { useContext, useEffect } from "react";
import OnlineUserContext from "../store/OnlineUserContext";

const User = ({ navigation, data, index }) => {
  const handlePress = () => {
    // if (data.name === "You") {
    //   Alert.alert("You", "You cannot chat with yourself");
    //   return;
    // }
    navigation.navigate("Chat", {
      id: data._id,
      name: data.name,
      image: data.image,
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View
        key={data._id}
        style={{
          width: 90,
          height: 120,

          flexDirection: "column",
          padding: 10,
          paddingVertical: 20,
          // backgroundColor: "red",
        }}
      >
        {data.online === true ? (
          <View
            style={{
              position: "relative",
              top: 8,
              left: 45,
              width: 10,
              height: 10,
              borderWidth: 1,
              borderRadius: 50,
              backgroundColor: "red",
              zIndex: 2,
            }}
          />
        ) : (
          <View
            style={{
              position: "relative",
              top: 8,
              left: 45,
              width: 10,
              height: 10,
            }}
          />
        )}
        <View>
          <Image
            source={{
              uri: data.image,
            }}
            style={{ borderWidth: 1, borderRadius: 50, width: 50, height: 50 }}
          />

          <View>
            <Text style={{ textAlign: "left" }}> {data.name}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
const UsersScreen = ({ navigation }) => {
  const onlineUserCtx = useContext(OnlineUserContext);

  const data = onlineUserCtx.onlineUsers;
  // useEffect(() => {
  //   onlineUserCtx.refresh();
  // }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          padding: 5,
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
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
    </ScrollView>
  );
};

export default UsersScreen;
