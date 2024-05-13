import React, { useContext, useLayoutEffect } from "react";
import { View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/AntDesign";

import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UserScreen";
import LoginContext from "../store/AuthContext";
import OnlineUserContext from "../store/OnlineUserContext";

const Tab = createMaterialTopTabNavigator();

const MyTabs = ({ navigation }) => {
  const loginctx = useContext(LoginContext);
  const onlineUserCtx = useContext(OnlineUserContext);
  const handleLogout = () => {
    loginctx.logout();
    onlineUserCtx.clear();
    navigation.replace("Authentication");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ padding: 5 }}>
          <Icon name="logout" size={25} color="black" onPress={handleLogout} />
        </View>
      ),
    });
  }, [navigation]);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Users" component={UsersScreen} />
    </Tab.Navigator>
  );
};

export default MyTabs;
