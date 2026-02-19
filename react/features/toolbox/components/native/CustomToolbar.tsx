import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAudioMuted } from "../../../base/media/actions";
import Icon from "../../../base/icons/components/Icon";
import { IconMic, IconMicSlash } from "../../../base/icons/svg";
import { MEDIA_TYPE } from "../../../base/media/constants";

// ✅ Import these
import { hangup } from "../../../base/connection/actions.native";
import { appNavigate } from "../../../app/actions.native";
import { endConference } from "../../../base/conference/actions";
import { requestEnableAudioModeration, requestDisableAudioModeration } from "../../../av-moderation/actions.ts";
import { muteAllParticipants } from "../../../video-menu/actions.any.ts";
import { getCurrentConference } from "../../../base/conference/functions";
import jwt_decode from "jwt-decode";
// import { getJWT } from "../../../base/jwt/functions";
// import { getState } from "../../../base/redux/functions";
// import { useSelector } from "react-redux";

export default function CustomToolbar() {
    const dispatch = useDispatch();

    const isMuted = useSelector((state) => state["features/base/media"]?.audio?.muted ?? false);

    // ✅ Mute all participants AND enable moderation
    const handleMuteAll = () => {
        console.log("🔇 Muting all participants");

        // Step 1: Mute everyone
        dispatch(muteAllParticipants([], MEDIA_TYPE.AUDIO));

        // Step 2: Enable audio moderation (prevents unmuting without approval)
        setTimeout(() => {
            dispatch(requestEnableAudioModeration());
        }, 100);
    };

    // ✅ Allow everyone to speak
    const handleAllowSpeaking = () => {
        console.log("🎤 Allowing all to speak");

        // Disable audio moderation
        dispatch(requestDisableAudioModeration());
    };

    // ✅ End meeting
    // const handleEndMeeting = () => {
    //     console.log("📞 End Meeting clicked");

    //     dispatch(endConference());
    //     dispatch(appNavigate(undefined));
    // };

    const jwtState = useSelector((state) => state["features/base/jwt"]) ?? {};
    const jwtToken = jwtState?.jwt;

    // ✅ Manually decode the JWT
    let decoded = null;
    let roomId = null;
    let adminToken = null;

    try {
        if (jwtToken) {
            decoded = jwt_decode(jwtToken);
            console.log("✅ Decoded JWT:", decoded);

            roomId = decoded?.roomId;
            adminToken = decoded?.adminToken;

            console.log("✅ Room ID:", roomId);
            console.log("✅ Admin Token:", adminToken);
        } else {
            console.log("❌ No JWT token found");
        }
    } catch (error) {
        console.log("❌ JWT decode error:", error);
    }

    // const handleEndMeeting = async () => {
    //     try {
    //         await fetch(`https://backend.konvoxa.com/api/rooms/end-meeting/${roomId}`, {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${adminToken}`, // admin jwt
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         dispatch(endConference());
    //         dispatch(appNavigate(undefined));
    //     } catch (err) {
    //         console.error("End meeting API failed", err);
    //     }
    // };

    // const handleMuteAll = () => {
    //     dispatch(requestEnableAudioModeration());

    //     setTimeout(() => {
    //         dispatch(muteAllParticipants([], MEDIA_TYPE.AUDIO));
    //     }, 500);
    // };

    // ✅ End meeting
    const handleEndMeeting = async () => {
        if (!roomId) {
            console.log("❌ No roomId found!");
            // alert("Error: Could not determine room ID");
            return;
        }

        if (!adminToken) {
            console.log("❌ No admin token found!");
            // alert("Error: Could not determine admin token");
            return;
        }

        console.log(`📞 Ending meeting for room: ${roomId}`);

        try {
            const response = await fetch(`https://backend.konvoxa.com/api/rooms/end-meeting/${roomId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log("✅ End meeting response:", data);

            if (data.success || response.ok) {
                dispatch(endConference());
                dispatch(appNavigate(undefined));
            } else {
                console.log("❌ End meeting failed:", data.message);
            }
        } catch (err) {
            console.log("❌ End meeting API error:", err);
        }
    };

    const isAudioModerationEnabled = useSelector((state) => state["features/av-moderation"]?.audioModerationEnabled);

    // const handleAllowSpeaking = () => {
    //     dispatch(requestDisableAudioModeration());
    // };

    return (
        <View style={styles.container}>
            <View style={styles.toolbar}>
                {/* Mute All */}
                {isAudioModerationEnabled ? (
                    <TouchableOpacity onPress={handleAllowSpeaking} style={styles.allowButton} activeOpacity={0.7}>
                        <Text style={styles.allowText}>UNMUTE ALL</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleMuteAll} style={styles.muteAllButton} activeOpacity={0.7}>
                        <Text style={styles.muteAllText}>MUTE ALL</Text>
                    </TouchableOpacity>
                )}

                {/* Mic */}
                <TouchableOpacity
                    onPress={() => dispatch(setAudioMuted(!isMuted))}
                    style={[styles.micButton, { backgroundColor: isMuted ? "#dc3545" : "#28a745" }]}
                >
                    <View style={styles.innerGlow} />
                    <Icon size={36} color="#fff" src={isMuted ? IconMicSlash : IconMic} />
                </TouchableOpacity>

                {/* End Meeting */}
                <TouchableOpacity onPress={handleEndMeeting} style={styles.endButton} activeOpacity={0.7}>
                    <Text style={styles.endButtonText}>END MEETING</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        paddingVertical: 10,
        width: "100%",
        backgroundColor: "#1e90ff",
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
    allowButton: {
        backgroundColor: "#28a745", // Green for allow
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 6,
        minWidth: 95,
        alignItems: "center",
    },
    allowText: {
        fontWeight: "700",
        fontSize: 11,
        color: "#fff",
    },
    micButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: "#302f2f",
        borderWidth: 5,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "50%",
        marginLeft: -35,
        overflow: "hidden",
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
    innerGlow: {
        position: "absolute",
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.15)",
    },
});
