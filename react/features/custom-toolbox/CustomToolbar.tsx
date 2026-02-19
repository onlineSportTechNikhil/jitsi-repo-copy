import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons"; // or your icon library
import { setAudioMuted } from "../base/media/actions";
import { customButtonPressed } from "./actions.native";

export default function CustomToolbar() {
    const dispatch = useDispatch();

    const isMuted = useSelector((state) => state["features/base/media"]?.audio?.muted ?? false);

    return (
        <View style={styles.container}>
            {/* Status Bar */}
            <View style={styles.statusBar}>
                <Text style={styles.statusText}>Connected</Text>
            </View>

            {/* Main Toolbar */}
            <View style={styles.toolbar}>
                {/* Mute All Button */}
                <TouchableOpacity
                    onPress={() => dispatch({ type: "MUTE_ALL_PARTICIPANTS" })}
                    style={styles.muteAllButton}
                >
                    <Text style={styles.muteAllText}>MUTE ALL</Text>
                </TouchableOpacity>

                {/* Microphone Button (Center) */}
                <TouchableOpacity
                    onPress={() => dispatch(setAudioMuted(!isMuted))}
                    style={[styles.micButton, { backgroundColor: isMuted ? "#dc3545" : "#28a745" }]}
                >
                    <Icon name={isMuted ? "mic-off" : "mic"} size={36} color="#fff" />
                </TouchableOpacity>

                {/* End Meeting Button */}
                <TouchableOpacity onPress={() => dispatch(conferenceWillLeave())} style={styles.endButton}>
                    <Text style={styles.endButtonText}>END MEETING</Text>
                </TouchableOpacity>

                {/* Back Arrow */}
                <TouchableOpacity
                    onPress={() => {
                        /* navigate back */
                    }}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Bottom Menu Bar */}
            <View style={styles.bottomMenu}>
                <TouchableOpacity
                    onPress={() => {
                        /* toggle menu */
                    }}
                >
                    <Icon name="menu" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#1e90ff",
    },
    statusBar: {
        alignItems: "center",
        paddingVertical: 4,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
    },
    statusText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        position: "relative",
    },
    muteAllButton: {
        backgroundColor: "#ffc107",
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 6,
        minWidth: 95,
        alignItems: "center",
    },
    muteAllText: {
        fontWeight: "700",
        fontSize: 11,
        color: "#000",
    },
    micButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "50%",
        marginLeft: -35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    endButton: {
        backgroundColor: "#dc3545",
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderRadius: 6,
        minWidth: 115,
        alignItems: "center",
    },
    endButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 10,
    },
    backButton: {
        position: "absolute",
        right: 15,
        top: 12,
        padding: 8,
    },
    bottomMenu: {
        alignItems: "center",
        paddingVertical: 10,
        paddingBottom: 15,
    },
});
