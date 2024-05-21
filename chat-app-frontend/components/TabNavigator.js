import React, { useContext, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HomeScreen from "../screens/HomeScreen";
import UsersScreen from "../screens/UserScreen";
import LoginContext from "../store/AuthContext";
import OnlineUserContext from "../store/OnlineUserContext";

import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconMaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

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
        <View style={{ paddingRight: 10 }}>
          {/* <Icon name="logout" size={25} color="black" onPress={handleLogout} /> */}
          <Menu>
            <MenuTrigger>
              <IconIonicons name="ellipsis-vertical" size={25} color="black" />
            </MenuTrigger>

            <MenuOptions>
              <MenuOption onSelect={() => navigation.navigate("Account")}>
                <View
                  style={{
                    padding: 5,
                    paddingBottom: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <IconMaterialCommunity
                    name="account"
                    size={25}
                    color="black"
                  />
                  <Text>Account</Text>
                </View>
              </MenuOption>

              <MenuOption onSelect={() => handleLogout()}>
                <View
                  style={{
                    padding: 5,
                    paddingBottom: 0,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <IconAntDesign name="logout" size={25} color="black" />
                  <Text>Logout</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
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
