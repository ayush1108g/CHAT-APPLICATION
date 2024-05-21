import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import MessageContext from "../store/MessageContext";
import LoginContext from "../store/AuthContext";
import { DataContext } from "../store/DataContext";

import ListComponent from "../components/ListComponent";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconIonicons from "react-native-vector-icons/Ionicons";

const HomeScreen = ({ navigation, route }) => {
  const dataCtx = useContext(DataContext);
  const loginCtx = useContext(LoginContext);
  const messageCtx = useContext(MessageContext);
  const data = messageCtx?.messages;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const forwarding = dataCtx.forwarding;
  const setForwarding = dataCtx.setForwarding;

  useEffect(() => {
    if (messageCtx?.messages) {
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [messageCtx]);
  useEffect(() => {
    if (!loginCtx?.isLoggedIn) {
      navigation.navigate("Authentication");
    }
  }, [loginCtx]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    messageCtx.refreshMessages();
    setRefreshing(false);
  }, []);

  const forwardMessagehandler = () => {
    if (forwarding.length > 0 && selectedId.length > 0) {
      messageCtx.forwardMessage(forwarding, selectedId);
      setSelectedId([]);
      setForwarding([]);
    }
  };
  const cancelForwardingHandler = () => {
    setSelectedId([]);
    setForwarding([]);
  };

  return (
    <View style={{ flex: 1 }}>
      {forwarding.length > 0 && (
        <View style={styles.selectContainer}>
          <View style={{ flexDirection: "row" }}>
            <IconEntypo
              name="cross"
              size={20}
              color="black"
              onPress={cancelForwardingHandler}
            />
            <Text>Cancel Forwarding</Text>
          </View>
          <View>
            <Text>{selectedId.length} Chats Selected</Text>
          </View>
        </View>
      )}
      {data.length === 0 && !loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>No Chats</Text>
        </View>
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ListComponent
              navigation={navigation}
              item={item}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      {forwarding.length > 0 && (
        <View style={styles.icon}>
          <IconIonicons
            name="send-sharp"
            size={30}
            color="black"
            onPress={forwardMessagehandler}
          />
        </View>
      )}
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  selectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    // elevation: 1,
  },
  container: {
    flexDirection: "column",
    flex: 1,
  },
  icon: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
