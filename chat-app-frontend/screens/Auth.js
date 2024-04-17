import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import LoginContext from "../store/AuthContext";
import axios from "axios";
import { baseBackendUrl } from "../constant";

const Auth = ({ navigation }) => {
  const loginctx = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loginctx.isLoggedIn) {
      navigation.replace("MyApp");
    }
  }, [loginctx.isLoggedIn]);

  const handleLogin = async () => {
    setMessage("");
    if (email.length <= 5 || password.length < 8) {
      return setMessage("Password must be at least 8 characters long");
    }
    console.log("Logging in with:", email, password);
    try {
      const response = await axios.post(`${baseBackendUrl}/auth/login`, {
        email: email,
        password: password,
      });
      setMessage("Login successful");
      console.log(response.data);
      loginctx.login(
        response.data.token,
        response.data.data.user.name,
        response.data.data.user._id,
        response.data.data.user.email
      );
      navigation.replace("MyApp");
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };

  const handleSignup = async () => {
    setMessage("");
    if (email.length <= 5 || password.length < 8) {
      return setMessage("Password must be at least 8 characters long");
    }
    console.log("Signing up with:", name, email, password);
    console.log(`${baseBackendUrl}/auth/signup`);
    try {
      const response = await axios.post(`${baseBackendUrl}/auth/signup`, {
        name: name,
        email: email,
        password: password,
      });
      setMessage("Signup successful");
      console.log(response.data);
      loginctx.login(
        response.data.token,
        response.data.data.user.name,
        response.data.data.user._id,
        response.data.data.user.email
      );
      navigation.replace("MyApp");
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const [emailFocused, setEmailFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {message.length > 0 && (
          <View
            style={{ padding: 10, backgroundColor: "red", marginBottom: 10 }}
          >
            <Text>{message}</Text>
          </View>
        )}
        <Text style={styles.title}>{isLogin ? "Login" : "Signup"}</Text>
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text
              style={[
                styles.placeholder,
                nameFocused && styles.placeholderFocused,
              ]}
            >
              {(name.length === 0 || nameFocused) && "Name"}
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              autoCapitalize="none"
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.placeholder,
              emailFocused && styles.placeholderFocused,
            ]}
          >
            {(email.length == 0 || emailFocused) && "Email"}
          </Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.placeholder,
              passwordFocused && styles.placeholderFocused,
            ]}
          >
            {(password.length == 0 || passwordFocused) && "Password"}
          </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry
          />
        </View>
        {isLogin ? (
          <Button title="Login" onPress={handleLogin} />
        ) : (
          <Button title="Signup" onPress={handleSignup} />
        )}
        <Text style={styles.toggle} onPress={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  placeholder: {
    position: "absolute",
    left: 10,
    top: 12,
    fontSize: 16,
    color: "gray",
  },
  placeholderFocused: {
    top: -8,
    fontSize: 12,
    color: "blue",
  },
  toggle: {
    marginTop: 20,
    color: "blue",
  },
});

export default Auth;
