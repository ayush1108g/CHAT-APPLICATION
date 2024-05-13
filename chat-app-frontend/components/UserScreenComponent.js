import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

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
      <View key={data._id} style={styles.container}>
        {data.online === true ? (
          <View style={styles.innerContainer1} />
        ) : (
          <View style={styles.innerContainer2} />
        )}
        <View>
          <Image source={{ uri: data.image }} style={styles.imageContainer} />
          <View>
            <Text style={{ textAlign: "left" }}> {data.name}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 120,
    flexDirection: "column",
    padding: 10,
    paddingVertical: 20,
    // backgroundColor: "red",
  },
  innerContainer1: {
    position: "relative",
    top: 8,
    left: 45,
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "red",
    zIndex: 2,
  },
  innerContainer2: {
    position: "relative",
    top: 8,
    left: 45,
    width: 10,
    height: 10,
  },
  imageContainer: { borderWidth: 1, borderRadius: 50, width: 50, height: 50 },
});
