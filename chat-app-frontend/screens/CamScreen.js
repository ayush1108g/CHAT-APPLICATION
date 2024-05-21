import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { Permissions } from "expo";
import { StatusBar } from "expo-status-bar";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { DataContext } from "../store/DataContext";

export default function RecordScreen({ navigation }) {
  const DataCtx = useContext(DataContext);

  const { capturedImage, setCapturedImage } = DataCtx;
  const [startCamera, setStartCamera] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setStartCamera(true);
      } else {
        Alert.alert("Access denied to camera");
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo);
      } catch (error) {
        console.error("Failed to take picture", error);
        Alert.alert("Failed to take picture", error.message);
      }
    }
  };

  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  const switchCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  console.log(capturedImage);

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const sendImageHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={cameraType}
            flashMode={flashMode}
            ref={cameraRef}
          >
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.flashButton}
                onPress={toggleFlashMode}
              >
                <IconIonicons
                  name="flashlight"
                  size={30}
                  color={flashMode ? "white" : "grey"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.switchCameraButton}
                onPress={switchCameraType}
              >
                <IconIonicons
                  name="camera-reverse-outline"
                  size={30}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          </Camera>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <IconIonicons name="camera-outline" size={30} color={"white"} />
              <Text style={styles.buttonText}>
                {capturedImage ? "Retake" : "Take Picture"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => setCapturedImage(null)}
            >
              {capturedImage && (
                <>
                  <IconIonicons name="close" size={30} color={"white"} />
                  <Text style={styles.buttonText}>Cancel</Text>
                </>
              )}
            </TouchableOpacity>

            {capturedImage && (
              <TouchableOpacity onPress={openModal}>
                <View style={styles.preview}>
                  <Image
                    source={{ uri: capturedImage.uri }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity onPress={sendImageHandler}>
                    <View
                      style={{
                        flexDirection: "row",
                        position: "absolute",
                        right: 10,
                        bottom: 150,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white" }}>Send </Text>
                      <IconIonicons
                        name="send-sharp"
                        size={30}
                        color={"white"}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableHighlight
            onPress={closeModal}
            style={{ width: "100%", height: "100%", alignItems: "center" }}
          >
            <Image
              source={{ uri: capturedImage?.uri }}
              style={styles.fullScreenImage}
            />
          </TouchableHighlight>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  flashButton: {
    backgroundColor: "rgba(255,0,255,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  switchCameraButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    paddingHorizontal: 20,
  },
  captureButton: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    paddingBottom: 10,
  },
  loadingText: {
    fontSize: 20,
  },
  preview: {
    marginTop: 20,
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    width: width,
    height: height,
    alignItems: "center",
    backgroundColor: "black",
  },
  fullScreenImage: {
    width: "90%",
    height: height,
    resizeMode: "contain",
  },
});
