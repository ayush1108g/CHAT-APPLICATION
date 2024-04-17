import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAlert } from '../store/AlertContext';

const Alert = ({ type, message, title }) => {
    const { hideAlert } = useAlert();
    type = type || 'success';
    const [visible, setVisible] = useState(true);
    const alertStack = useRef([]);
    useEffect(() => {
        alertStack.current.push({ message, title, setVisible });
        const timeout = setTimeout(() => {
            hideCurrentAlert();
        }, 4000);

        return () => {
            clearTimeout(timeout);
        };
    }, [message, hideAlert]);


    const hideCurrentAlert = () => {
        const { setVisible } = alertStack.current[0];
        setVisible(false);
        setTimeout(() => {
            alertStack.current.shift();
            if (alertStack.current.length > 0) {
                alertStack.current[0].setVisible(true);
            } else {
                hideAlert();
            }
        }, 500);
    };

    const hideHandler = () => {
        hideCurrentAlert();
    };

    return (
        <Animatable.View
            animation={visible ? 'slideInRight' : 'slideOutUp'}
            duration={500}
            style={[styles.alert, { backgroundColor: '#333333' }]}
        >
            <Text style={[styles.message, { color: type === 'error' ? '#F2613F' : '#ffffff' }]}>{alertStack?.current[0]?.title ? alertStack?.current[0]?.title + '   ' : title ? title + "    " : " "}{alertStack?.current[0]?.message || message ? message : " "}</Text>
            <TouchableOpacity onPress={hideHandler} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>&times;</Text>
            </TouchableOpacity>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    alert: {
        flexDirection: 'row',
        position: 'absolute',
        top: 90,
        right: 10,
        zIndex: 1000,
        minWidth: 250,
        padding: 10,
        borderRadius: 5,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        flex: 1,
    },
    closeButton: {
        marginLeft: 10,
        padding: 5,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#ffffff',
    },
});

export default Alert;
