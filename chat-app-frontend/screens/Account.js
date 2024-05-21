import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import React, { useContext, useLayoutEffect, useState } from "react";

import LoginContext from "../store/AuthContext";
import OnlineUserContext from "../store/OnlineUserContext";
import { useAlert } from "../store/AlertContext";

import IconMaterialCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import { baseBackendUrl } from "../constant";
import axios from "axios";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

const Account = () => {
  const alertCtx = useAlert();
  const loginCtx = useContext(LoginContext);
  const onlineUserCtx = useContext(OnlineUserContext);
  const data = onlineUserCtx.onlineUsers;
  const currentUser = data.find((item) => item._id === loginCtx.userid);
  const [imageUrl, setImageUrl] = useState(null);

  useLayoutEffect(() => {
    setImageUrl(null);
  }, []);
  console.log(currentUser);
  const generateRandom = () => {
    let url = "https://picsum.photos/" + Math.floor(Math.random() * 750 + 220);
    console.log(url);
    setImageUrl(url);
  };

  const saveImageHandler = async () => {
    if (!imageUrl) return;
    try {
      const resp = await axios.patch(
        `${baseBackendUrl}/auth/updatedetails`,
        {
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${loginCtx.token}`,
          },
        }
      );
      onlineUserCtx.refresh();
      alertCtx.showAlert(
        "success",
        "Image Changed SuccessFul,It will take sometime to be visible"
      );
      setImageUrl(null);
    } catch (e) {
      console.log(e, "error from Account.js");
    }
  };
  return (
    <View style={styles.mainContainer}>
      <View>
        <Image
          source={{ uri: imageUrl || currentUser.image }}
          alt="image"
          style={{ width: 200, height: 200, borderRadius: 100 }}
        />
        <View style={{ alignItems: "flex-end" }}>
          <Menu>
            <MenuTrigger>
              <IconMaterialCommunity
                name="lead-pencil"
                size={30}
                color={"red"}
                style={{ position: "relative", right: 0, top: -30 }}
              />
            </MenuTrigger>

            <MenuOptions>
              <MenuOption onSelect={() => generateRandom()}>
                <View style={{ flexDirection: "row" }}>
                  <Text>Random Image</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => generateRandom()}>
                <View style={{ flexDirection: "row" }}>
                  <Text>Select From Gallery</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View style={styles.innerCont2}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {loginCtx?.name}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 14 }}>
          {loginCtx?.email || currentUser?.email}
        </Text>
      </View>

      {imageUrl && (
        <View style={styles.saveContent}>
          <TouchableHighlight onPress={saveImageHandler}>
            <>
              <IconMaterialCommunity
                name="content-save"
                size={30}
                color={"black"}
              />
              <Text> Save</Text>
            </>
          </TouchableHighlight>
        </View>
      )}
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 25,
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  innerCont2: {
    padding: 10,
    alignItems: "center",
  },
  saveContent: {
    alignItems: "center",
    position: "absolute",
    bottom: -60,
    right: 30,
  },
});
