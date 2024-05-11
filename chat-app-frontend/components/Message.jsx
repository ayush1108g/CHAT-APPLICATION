import React, { useEffect, useState } from "react";
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, Modal, PanResponder, StyleSheet, Dimensions } from "react-native";

import ChatleftComponent from "../components/chatleft";
import ChatRightComponent from "../components/chatright";

const MessageRow = ({
    data,
    allData,
    userid,
    name,
    scrollToHandler,
    highlighted,
    setHighlightedMsg,
    index
}) => {
    console.log(index);
    let prevDateEqual = index === 0 || index > 0 && new Date(data.timeStamp).toDateString() === new Date(allData[index - 1]?.timeStamp).toDateString();
    if (index === allData.length - 1) prevDateEqual = false;
    const ismsgHighlighted = highlighted.includes(data?._id);
    let date;
    if (index === 0) date = new Date(data.timeStamp);
    else
        date = new Date(allData[index - 1].timeStamp);
    const dateStr = date.toDateString("en-US", "short");
    // const LongPressHandler = () => {
    //     console.log("long press");
    //     setHighlightedMsg((prev) => [...prev, data._id]);
    // };

    return <View style={{ backgroundColor: 'white' }}>
        <>
            {prevDateEqual ? null : (
                <View style={{ alignItems: "center", marginVertical: 10 }}>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{dateStr}</Text>
                    </View>
                </View>
            )}
            {data.from === userid ? (
                <View
                    style={{
                        maxWidth: "100%",
                        backgroundColor: ismsgHighlighted ? "lightgrey" : "white",
                    }}
                >
                    <ChatRightComponent
                        key={data?._id}
                        data={data}
                        allData={allData}
                        name={name}
                        scrollToHandler={scrollToHandler}
                        highlighted={highlighted}
                        setHighlightedMsg={setHighlightedMsg}
                    />
                </View>
            ) : (
                <View
                    style={{
                        maxWidth: "100%",
                        backgroundColor: ismsgHighlighted ? "lightgrey" : "white",
                    }}
                >
                    <ChatleftComponent
                        key={data?._id}
                        data={data}
                        allData={allData}
                        name={name}
                        scrollToHandler={scrollToHandler}
                        highlighted={highlighted}
                        setHighlightedMsg={setHighlightedMsg}
                    />
                </View>
            )}
        </>

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