import React, { useContext } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import Image0 from "../assets/LOGO.jpg";
import Image1 from "../assets/BG1.jpg";
import Image2 from "../assets/BG2.jpg";
import Image3 from "../assets/BG3.jpeg";
import Image4 from "../assets/BG4.jpeg";
import Image5 from "../assets/BG5.jpeg";
import Image6 from "../assets/BG6.jpeg";
import Image7 from "../assets/BG7.jpeg";
import { ScrollView } from "react-native-gesture-handler";
import { DataContext } from "../store/DataContext";

const ChangeBG = ({ navigation }) => {
  const dataCtx = useContext(DataContext);
  const images = [
    Image0,
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Image7,
  ];

  const changebgHandler = (image) => {
    dataCtx.setBackground(image);
    // go back to the previous screen
    navigation.goBack();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <View style={styles.container}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => changebgHandler(image)}
            style={styles.imageContainer}
          >
            <Image source={image} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  imageContainer: {
    width: "47%",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderColor: "black",
    borderWidth: 1,
  },
});

export default ChangeBG;
