import React, { useEffect, useState } from "react";
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Modal, PanResponder, StyleSheet, Dimensions } from "react-native";

import ChatleftComponent from "../components/chatleft";
import ChatRightComponent from "../components/chatright";

function formatToIndianDate(timestamp) {
    const date = new Date(timestamp);
    const options = {
        weekday: 'long', // Full weekday name (e.g., "Tuesday")
        year: 'numeric', // Full numeric year (e.g., "2022")
        month: 'long', // Full month name (e.g., "January")
        day: 'numeric', // Day of the month (e.g., "18")
        timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
    };
    return date.toLocaleDateString('en-IN', options);
}

const MessageRow = ({
    index,
    data,
    allData,
    userid,
    name,
    highlighted,
    setReplyTo,
    scrollToHandler,
    setHighlightedMsg,
}) => {
    let prevDateEqual = formatToIndianDate(data.timeStamp) !== formatToIndianDate(allData[index + 1]?.timeStamp);
    const ismsgHighlighted = highlighted.includes(data);
    let date = new Date(data.timeStamp);
    const dateStr = date.toDateString("en-IN", "long");
    if (data?.forwardId) {
        // data._id = data._id + "+" + data?.forwardId?._id;
        data.message = data?.forwardId?.message;
        data.forward = true;
    }
    // console.log("data", data);
    // const LongPressHandler = () => {
    //     console.log("long press");
    //     setHighlightedMsg((prev) => [...prev, data._id]);
    // };

    return <View style={{}}>
        {prevDateEqual && (
            <View style={{ alignItems: "center", marginVertical: 10 }}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>{dateStr}</Text>
                </View>
            </View>
        )}
        {data.from === userid ? (
            <View style={[{ maxWidth: "100%", }, ismsgHighlighted && { backgroundColor: 'rgba(211, 211, 211,0.6)' }]}            >
                <ChatRightComponent
                    key={data?._id + data?.forwardId?._id}
                    data={data}
                    allData={allData}
                    name={name}
                    highlighted={highlighted}
                    setReplyTo={setReplyTo}
                    scrollToHandler={scrollToHandler}
                    setHighlightedMsg={setHighlightedMsg}
                />
            </View>
        ) : (
            <View style={[{ maxWidth: "100%", }, ismsgHighlighted && { backgroundColor: 'rgba(211, 211, 211,0.6)' }]}            >
                <ChatleftComponent
                    key={data?._id + data?.forwardId?._id}
                    data={data}
                    allData={allData}
                    name={name}
                    highlighted={highlighted}
                    scrollToHandler={scrollToHandler}
                    setReplyTo={setReplyTo}
                    setHighlightedMsg={setHighlightedMsg}
                />
            </View>
        )}
    </View>;
};

export default MessageRow;

const styles = StyleSheet.create({
    dateContainer: {
        backgroundColor: "#0088FF",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    dateText: {
        color: "white",
    },
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    modalContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        elevation: 5,
    },
    closeButton: {
        color: 'blue',
        marginTop: 10,
    },
});