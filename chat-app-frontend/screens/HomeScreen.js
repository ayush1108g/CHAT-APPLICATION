import { Text, View, StyleSheet, FlatList, Button } from "react-native";
import ListComponent from "../components/list-component";
import React, { useContext } from "react";
import MessageContext from "../store/MessageContext";

const HomeScreen = ({ navigation }) => {
  const messageCtx = useContext(MessageContext);
  const data = messageCtx.messages;
  console.log("hio", data[0]);
  // const data = [
  //   {
  //     id: "123",
  //     profile: "https://picsum.photos/150",
  //     name: "Ayush",
  //     lasttime: "yesterday",
  //     msgstatus: "seen",
  //     lastmsg: "asdfghjklertyuiop",
  //   },
  //   {
  //     id: "12345111",
  //     profile: "https://picsum.photos/204",
  //     name: "RAndom",
  //     lasttime: "today",
  //     msgstatus: "delivered",
  //     lastmsg:
  //       "Hi i am Ayush ertyuiopHi i am Ayush ertyuioHi i am Ayush ertyuioHi i am Ayush ertyuio",
  //   },
  //   {
  //     id: "12345-0",
  //     profile: "https://picsum.photos/203",
  //     name: "Random",
  //     lasttime: "12-08-2023",
  //     msgstatus: "sent",
  //     lastmsg:
  //       "Hi i am Ayush ertyuiopHi i am Ayush ertyuioHi i am Ayush ertyuioHi i am Ayush ertyuio",
  //   },
  //   {
  //     id: "123425",
  //     profile: "https://picsum.photos/201",
  //     name: "RAndom",
  //     lasttime: "12-08-2022",
  //     //   msgstatus: "sending",
  //     lastmsg:
  //       "Hi i am Ayush ertyuiopHi i am Ayush ertyuioHi i am Ayush ertyuioHi i am Ayush ertyuio",
  //   },
  //   {
  //     id: "3425",
  //     profile: "https://picsum.photos/221",
  //     name: "RAndom",
  //     lasttime: "12-08-2022",
  //     msgstatus: "sending",
  //     lastmsg:
  //       "Hi i am Ayush ertyuiopHi i am Ayush ertyuioHi i am Ayush ertyuioHi i am Ayush ertyuio",
  //   },
  // ];

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {/* <Text>Home!</Text> */}
      {/* <ListComponent /> */}
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListComponent navigation={navigation} item={item} />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      <Button
        title="nav"
        onPress={() => navigation.navigate("Notifications")}
      ></Button>
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
});
