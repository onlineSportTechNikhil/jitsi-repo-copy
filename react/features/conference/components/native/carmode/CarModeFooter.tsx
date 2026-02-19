import React, { useState } from "react";
import { Text, View, ViewStyle, Modal, TouchableOpacity, TextInput, FlatList, Linking, Image } from "react-native";
import { connect } from "react-redux";

import Video from "react-native-video"; // ✅ ADDED

import { IReduxState } from "../../../../app/types";
import { getConferenceName } from "../../../../base/conference/functions";
import { getLocalParticipant } from "../../../../base/participants/functions";

import EndMeetingButton from "./EndMeetingButton";
import SoundDeviceButton from "./SoundDeviceButton";
import styles from "./styles";

interface IProps {
    _meetingName: string;
    _username: string;
}

// ✅ icons
const volumeIcon = require("./assets/carmode/volume.png");
const phoneIcon = require("./assets/carmode/phone.png");
const userIcon = require("./assets/carmode/user.png");
const powerOffIcon = require("./assets/carmode/power-off.png");

const CarModeFooter = (props: IProps): JSX.Element => {
    const username = typeof props._username === "string" && props._username.trim() ? props._username.trim() : "";

    const API_BASE = "https://backend.konvoxa.com";

    // =========================
    // ✅ RECORDINGS STATES
    // =========================
    const [recordingModal, setRecordingModal] = useState(false);
    const [recordings, setRecordings] = useState<any[]>([]);
    const [recordingLoading, setRecordingLoading] = useState(false);

    // ✅ PLAYER MODAL STATES
    const [playerModal, setPlayerModal] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");
    const [audioPaused, setAudioPaused] = useState(false);

    const fetchRecordings = async () => {
        try {
            setRecordingLoading(true);

            const res = await fetch(`${API_BASE}/api/users/getRecording?username=${encodeURIComponent(username)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (data?.success) {
                setRecordings(data?.recordings || data?.data || []);
            } else {
                setRecordings([]);
            }
        } catch (err) {
            console.log("❌ Recording API error:", err);
            setRecordings([]);
        } finally {
            setRecordingLoading(false);
        }
    };

    // =========================
    // ✅ PASSWORD STATES
    // =========================
    const [passwordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passLoading, setPassLoading] = useState(false);
    const [passMsg, setPassMsg] = useState("");

    const changePassword = async () => {
        if (!currentPassword || !newPassword) {
            setPassMsg("⚠️ Please fill both passwords");
            return;
        }

        try {
            setPassLoading(true);
            setPassMsg("");

            const res = await fetch(`${API_BASE}/api/users/changePassFromWeb`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    username,
                }),
            });

            const data = await res.json();

            if (data?.success) {
                setPassMsg("✅ Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
            } else {
                setPassMsg(data?.message || "❌ Password change failed");
            }
        } catch (err) {
            console.log("❌ Change pass API error:", err);
            setPassMsg("❌ Server error");
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <View style={styles.bottomContainer as ViewStyle}>
            <View style={styles.actionRow as ViewStyle}>
                {/* ✅ Speaker toggle (DIRECT click, NO options) */}
                <SoundDeviceButton volumeIcon={volumeIcon} phoneIcon={phoneIcon} />

                {/* ✅ Password */}
                <TouchableOpacity
                    style={styles.actionCard as ViewStyle}
                    activeOpacity={0.8}
                    onPress={() => {
                        setPassMsg("");
                        setPasswordModal(true);
                    }}
                >
                    <Image source={userIcon} style={{ width: 45, height: 45, marginBottom: 6 }} resizeMode="contain" />
                    <Text style={styles.actionText}>Password</Text>
                </TouchableOpacity>

                {/* ✅ Recordings */}
                <TouchableOpacity
                    style={styles.actionCard as ViewStyle}
                    activeOpacity={0.8}
                    onPress={() => {
                        setRecordingModal(true);
                        fetchRecordings();
                    }}
                >
                    <Text style={styles.actionIcon}>▶️</Text>
                    <Text style={styles.actionText}>Recordings</Text>
                </TouchableOpacity>

                {/* ✅ Exit */}
                <View style={styles.actionCard as ViewStyle}>
                    <Image
                        source={powerOffIcon}
                        style={{ width: 45, height: 45, marginBottom: 6 }}
                        resizeMode="contain"
                    />
                    <Text style={styles.actionText}>Exit</Text>

                    <View style={styles.hiddenActionButton as ViewStyle}>
                        <EndMeetingButton />
                    </View>
                </View>
            </View>

            {/* ========================= */}
            {/* ✅ RECORDING MODAL */}
            {/* ========================= */}
            <Modal visible={recordingModal} transparent animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#111",
                            borderRadius: 14,
                            padding: 16,
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Recordings</Text>

                        <Text style={{ color: "#aaa", marginTop: 6 }}>Username: {username}</Text>

                        {recordingLoading ? (
                            <Text style={{ color: "#fff", marginTop: 12 }}>Loading...</Text>
                        ) : (
                            <FlatList
                                style={{ marginTop: 12, maxHeight: 280 }}
                                data={recordings}
                                keyExtractor={(item, index) => String(index)}
                                ListEmptyComponent={() => <Text style={{ color: "#aaa" }}>No recordings found</Text>}
                                renderItem={({ item }) => {
                                    const url = item?.userRecording || item?.url || item?.recordingUrl || "";

                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (!url) return;

                                                // ✅ close recordings modal
                                                setRecordingModal(false);

                                                // ✅ open player modal
                                                setCurrentUrl(url);
                                                setAudioPaused(false);
                                                setPlayerModal(true);
                                            }}
                                            style={{
                                                paddingVertical: 10,
                                                borderBottomWidth: 0.5,
                                                borderBottomColor: "#333",
                                            }}
                                        >
                                            <Text style={{ color: "#fff" }}>🎧 {item?.title || "Recording"}</Text>

                                            {url ? (
                                                <Text style={{ color: "#5aa7ff", marginTop: 4 }}>Play Audio</Text>
                                            ) : (
                                                <Text style={{ color: "#999", marginTop: 4 }}>No URL</Text>
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}

                        <TouchableOpacity
                            onPress={() => setRecordingModal(false)}
                            style={{
                                marginTop: 14,
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "#222",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ========================= */}
            {/* ✅ AUDIO PLAYER MODAL */}
            {/* ========================= */}
            <Modal visible={playerModal} transparent animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.7)",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#111",
                            borderRadius: 14,
                            padding: 16,
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Recording Audio</Text>

                        <Text style={{ color: "#aaa", marginTop: 6 }}>{currentUrl ? "Audio loaded ✅" : "No URL"}</Text>

                        {/* ✅ Audio Only Player */}
                        {currentUrl ? (
                            <Video
                                source={{ uri: currentUrl }}
                                audioOnly={true}
                                controls={true}
                                paused={audioPaused}
                                playInBackground={true}
                                playWhenInactive={true}
                                ignoreSilentSwitch="ignore"
                                style={{ width: 0, height: 0 }}
                                onError={(e) => console.log("❌ Player error:", e)}
                            />
                        ) : null}

                        {/* ✅ Pause / Resume */}
                        <TouchableOpacity
                            onPress={() => setAudioPaused(!audioPaused)}
                            style={{
                                marginTop: 14,
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "#2563eb",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>{audioPaused ? "Resume" : "Pause"}</Text>
                        </TouchableOpacity>

                        {/* ✅ Close */}
                        <TouchableOpacity
                            onPress={() => {
                                setPlayerModal(false);
                                setCurrentUrl("");
                                setAudioPaused(false);
                            }}
                            style={{
                                marginTop: 10,
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "#222",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Stop & Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ========================= */}
            {/* ✅ PASSWORD MODAL */}
            {/* ========================= */}
            <Modal visible={passwordModal} transparent animationType="fade">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "center",
                        padding: 16,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#111",
                            borderRadius: 14,
                            padding: 16,
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Change Password</Text>

                        <Text style={{ color: "#aaa", marginTop: 6 }}>Username: {username}</Text>

                        <TextInput
                            placeholder="Current Password"
                            placeholderTextColor="#777"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            style={{
                                marginTop: 12,
                                borderWidth: 1,
                                borderColor: "#333",
                                borderRadius: 10,
                                padding: 12,
                                color: "#fff",
                            }}
                        />

                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#777"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={{
                                marginTop: 10,
                                borderWidth: 1,
                                borderColor: "#333",
                                borderRadius: 10,
                                padding: 12,
                                color: "#fff",
                            }}
                        />

                        {!!passMsg && <Text style={{ color: "#fff", marginTop: 10 }}>{passMsg}</Text>}

                        <TouchableOpacity
                            disabled={passLoading}
                            onPress={changePassword}
                            style={{
                                marginTop: 14,
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "#2563eb",
                                alignItems: "center",
                                opacity: passLoading ? 0.6 : 1,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>
                                {passLoading ? "Please wait..." : "Update Password"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setPasswordModal(false)}
                            style={{
                                marginTop: 10,
                                padding: 12,
                                borderRadius: 10,
                                backgroundColor: "#222",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "700" }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

function _mapStateToProps(state: IReduxState) {
    const local = getLocalParticipant(state);

    return {
        _meetingName: getConferenceName(state),
        _username: local?.name || "",
    };
}

export default connect(_mapStateToProps)(CarModeFooter);
