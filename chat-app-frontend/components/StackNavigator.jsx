import React from "react";
import { View, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../screens/ChatScreen";
import AuthScreen from "../screens/Auth";
import ChatUserProfile from "../screens/ChatUserProfile";
import MyTabs from "./TabNavigator";
import ChangeBG from "../screens/ChangeBG";
import CamScreen from "../screens/CamScreen";
import Account from "../screens/Account";

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Authentication" component={AuthScreen} />
            <Stack.Screen name="Vartalapp" component={MyTabs} />
            <Stack.Screen name="Notifications" component={NotificationsPage} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="ChatUserProfile" component={ChatUserProfile} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="Camera" component={CamScreen} />
            <Stack.Screen name="Change Background" component={ChangeBG} />
        </Stack.Navigator>
    );
}

export default MyStack;

const NotificationsPage = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Notification</Text>
        </View>
    );
};