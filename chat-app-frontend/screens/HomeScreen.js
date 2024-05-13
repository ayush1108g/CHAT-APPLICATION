import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  RefreshControl,
} from "react-native";
import React, { useContext, useState } from "react";
import MessageContext from "../store/MessageContext";

import ListComponent from "../components/ListComponent";

const HomeScreen = ({ navigation }) => {
  const messageCtx = useContext(MessageContext);
  const data = messageCtx.messages;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    messageCtx.refreshMessages();
    setRefreshing(false);
  }, []);
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
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
