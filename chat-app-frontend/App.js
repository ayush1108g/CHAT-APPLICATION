import "react-native-gesture-handler";
import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    // handleRegistrationError("Must use physical device for push notifications");
    console.log("Must use physical device for push notifications");
  }
}

import { useState, useRef, useEffect, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LoginContextProvider } from "./store/AuthContext";
import { MessageContextProvider } from "./store/MessageContext";
import { OnlineUserContextProvider } from "./store/OnlineUserContext";
import { SocketContextProvider } from "./store/SocketContext";
import LoginContext from "./store/AuthContext";
// import MessageContext from "./store/MessageContext";
import { AlertProvider, useAlert } from "./store/AlertContext";
import AlertComp from "./components/alert";
import MyStack from "./components/StackNavigator";

import axios from "axios";
import { baseBackendUrl } from "./constant";

const MainContent = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  const loginctx = useContext(LoginContext);
  const alertCtx = useAlert();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log(notification);
        Alert.alert(
          "A new FCM message arrivedX!!",
          JSON.stringify(notification)
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
        Alert.alert("A new FCM message arrived2!", JSON.stringify(response));
      });

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage.notification
      );
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log(
        "Message handled in the background!",
        remoteMessage.notification
      );
    });
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrivedmsg2!", remoteMessage);
      // Alert.alert(
      //   "A new FCM message arrivedmsg2!",
      //   JSON.stringify(remoteMessage)
      // );
      alertCtx.showAlert(
        "success",
        remoteMessage?.data?.message || "New Message",
        remoteMessage?.data?.title || "New Message Arrived"
      );
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sendToken = async () => {
      if (expoPushToken && expoPushToken.trim().length > 0) {
        try {
          const resp = await axios.post(
            baseBackendUrl + "/auth/updateexpotoken",
            { token: expoPushToken },
            { headers: { Authorization: `Bearer ${loginctx.token}` } }
          );
          console.log(resp.data);
        } catch (e) {
          console.log(e);
        }
      }
    };
    sendToken();
  }, [expoPushToken, loginctx]);
  return (
    <View style={styles.containermain}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {alertCtx.alert && (
          <AlertComp
            type={alertCtx.alert.type}
            message={alertCtx.alert.message}
            title={alertCtx.alert.title}
          />
        )}
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <AlertProvider>
      <LoginContextProvider>
        <OnlineUserContextProvider>
          <MessageContextProvider>
            <SocketContextProvider>
              <MainContent />
            </SocketContextProvider>
          </MessageContextProvider>
        </OnlineUserContextProvider>
      </LoginContextProvider>
    </AlertProvider>
  );
}

const styles = StyleSheet.create({
  containermain: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -10,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
