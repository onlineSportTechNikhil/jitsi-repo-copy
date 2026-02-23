// import React, { useEffect, useState } from "react";
// import { View, ViewStyle, BackHandler, Text, TouchableOpacity, TextInput, FlatList, Dimensions } from "react-native";
// import Orientation from "react-native-orientation-locker";
// import { withSafeAreaInsets } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";

// import JitsiScreen from "../../../../base/modal/components/JitsiScreen";
// import LoadingIndicator from "../../../../base/react/components/native/LoadingIndicator";
// import TintedView from "../../../../base/react/components/native/TintedView";
// import { isLocalVideoTrackDesktop } from "../../../../base/tracks/functions.native";
// import { setPictureInPictureEnabled } from "../../../../mobile/picture-in-picture/functions";
// import { setIsCarmode } from "../../../../video-layout/actions";
// import { isConnecting } from "../../functions";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getLocalParticipant } from "../../../../base/participants/functions";
// import { StatusBar } from "react-native";
// import Sound from "react-native-sound";
// import CarModeFooter from "./CarModeFooter";
// import MicrophoneButton from "./MicrophoneButton";
// import TitleBar from "./TitleBar";
// import styles from "./styles";

// import { hangup } from "../../../../base/connection/actions.native";
// import { appNavigate } from "../../../../app/actions.native";

// import Video from "react-native-video";
// import { NativeModules } from "react-native";
// const { AudioMode } = NativeModules;

// const { width, height } = Dimensions.get("window");
// interface IProps {
//     _meetingName: string;
//     _username: string;
// }
// const CarMode = (): JSX.Element => {
//     const dispatch = useDispatch();
//     const connecting = useSelector(isConnecting);
//     const isSharing = useSelector(isLocalVideoTrackDesktop);
//     const local = useSelector(getLocalParticipant);

//     const username = (local?.name && local.name.trim()) || (local?.displayName && local.displayName.trim()) || "";

//     const API_BASE = "https://backend.konvoxa.com";

//     const [adminMsg, setAdminMsg] = useState("");

//     const [recordingModal, setRecordingModal] = useState(false);
//     const [passwordModal, setPasswordModal] = useState(false);
//     const [playerModal, setPlayerModal] = useState(false);

//     const [recordings, setRecordings] = useState<any[]>([]);
//     const [recordingLoading, setRecordingLoading] = useState(false);

//     const [currentUrl, setCurrentUrl] = useState("");
//     const [audioPaused, setAudioPaused] = useState(false);

//     const [currentPassword, setCurrentPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");
//     const [passMsg, setPassMsg] = useState("");

//     /* ---------------- RECORDINGS ---------------- */

//     const fetchRecordings = async () => {
//         try {
//             setRecordingLoading(true);
//             const res = await fetch(`${API_BASE}/api/users/getRecording?username=${encodeURIComponent(username)}`);
//             const data = await res.json();

//             if (data?.success) {
//                 setRecordings(data?.recordings || data?.data || []);
//             } else {
//                 setRecordings([]);
//             }
//         } catch {
//             setRecordings([]);
//         } finally {
//             setRecordingLoading(false);
//         }
//     };
//     const handleChangePassword = async () => {
//         if (!currentPassword || !newPassword) {
//             setPassMsg("⚠️ Please fill both passwords");
//             return;
//         }

//         try {
//             const res = await fetch(`${API_BASE}/api/users/changePassFromWeb`, {
//                 method: "PUT", // ✅ IMPORTANT
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                     username,
//                     currentPassword,
//                     newPassword,
//                 }),
//             });

//             const data = await res.json();

//             if (data?.success) {
//                 // alert("✅ Password changed successfully!");
//                 setPassMsg("✅ Password changed successfully!");
//                 setCurrentPassword("");
//                 setNewPassword("");
//                 setPasswordModal(false);
//             } else {
//                 setPassMsg(data?.message || "❌ Password change failed");
//             }
//         } catch (error) {
//             console.log("Password error:", error);
//             setPassMsg("❌ Server error");
//         }
//     };

//     /* ---------------- LIFECYCLE ---------------- */

//     useEffect(() => {
//         dispatch(setIsCarmode(true));
//         setPictureInPictureEnabled(false);
//         Orientation.lockToPortrait();

//         const onBackPress = () => {
//             dispatch(hangup());
//             dispatch(appNavigate(undefined));
//             return true;
//         };

//         const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

//         return () => {
//             backHandler.remove();
//             Orientation.unlockAllOrientations();
//             dispatch(setIsCarmode(false));
//             if (!isSharing) setPictureInPictureEnabled(true);
//         };
//     }, []);

//     /* ---------------- ADMIN MESSAGE ---------------- */

//     useEffect(() => {
//         const fetchAdminDetails = async () => {
//             try {
//                 const API_BASE = "https://backend.konvoxa.com";

//                 const res = await fetch(`${API_BASE}/api/users/adminDetail?username=${encodeURIComponent(username)}`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 const data = await res.json();
//                 console.log("✅ API response:", data);
//                 setAdminMsg(data?.message || "");
//             } catch (err) {
//                 console.log("❌ Admin detail API error:", err);
//             }
//         };

//         fetchAdminDetails();
//     }, []);

//     /* ================= UI ================= */

//     return (
//         <JitsiScreen style={styles.conference}>
//             <StatusBar backgroundColor="#007BFF" barStyle="light-content" />

//             {connecting && (
//                 <TintedView>
//                     <LoadingIndicator />
//                 </TintedView>
//             )}

//             {/* HEADER */}
//             <SafeAreaView edges={["top"]} style={styles.titleBarSafeViewColor as ViewStyle}>
//                 <View style={styles.titleBar as ViewStyle}>
//                     <TitleBar />
//                 </View>
//             </SafeAreaView>

//             {/* BODY */}
//             <View
//                 style={[
//                     styles.body as ViewStyle,
//                     { position: "relative", overflow: "visible" }, // 🔥 important
//                 ]}
//             >
//                 <View style={styles.footerInsideBody as ViewStyle}>
//                     <CarModeFooter
//                         onOpenRecording={() => {
//                             setRecordingModal(true);
//                             fetchRecordings();
//                         }}
//                         onOpenPassword={() => setPasswordModal(true)}
//                     />
//                 </View>

//                 <View style={styles.microphoneContainer as ViewStyle}>
//                     <MicrophoneButton />
//                 </View>
//             </View>

//             {/* 🔥 ADMIN MESSAGE — OUTSIDE BODY */}
//             {!!adminMsg && (
//                 <View
//                     pointerEvents="none"
//                     style={{
//                         position: "absolute",
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         alignItems: "center",
//                         zIndex: 8000,
//                         elevation: 8000,
//                     }}
//                 >
//                     <View
//                         style={{
//                             backgroundColor: "#000000",
//                             paddingVertical: 10,
//                             paddingHorizontal: 16,
//                             // borderRadius: 14,
//                             // borderWidth: 1,
//                             // borderColor: "#2563eb",
//                             width: "100%",
//                         }}
//                     >
//                         <Text
//                             style={{
//                                 color: "#fff",
//                                 textAlign: "center",
//                                 fontSize: 15,
//                                 fontWeight: "700",
//                             }}
//                         >
//                             {adminMsg ?? "fksndknf"}
//                         </Text>
//                     </View>
//                 </View>
//             )}

//             {/* 🔥 OVERLAY ROOT */}
//             {/* 🔥 OVERLAY ROOT */}
//             {(recordingModal || passwordModal || playerModal) && (
//                 <View
//                     pointerEvents="box-none" // ✅ allows touches to pass through to children
//                     style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         backgroundColor: "rgba(0,0,0,0.6)",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         zIndex: 9999,
//                         elevation: 9999,
//                     }}
//                 >
//                     <View
//                         pointerEvents="auto" // ✅ this inner card captures all touches normally
//                         style={{
//                             backgroundColor: "#111",
//                             borderRadius: 14,
//                             padding: 16,
//                             width: width - 32,
//                             maxHeight: height * 0.7,
//                         }}
//                     >
//                         {/* Recording Modal */}
//                         {recordingModal && (
//                             <>
//                                 <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Recordings</Text>

//                                 {recordingLoading ? (
//                                     <Text style={{ color: "#fff", marginTop: 12 }}>Loading...</Text>
//                                 ) : (
//                                     <FlatList
//                                         style={{ marginTop: 12 }}
//                                         data={recordings}
//                                         keyExtractor={(_, i) => String(i)}
//                                         scrollEnabled={true} // ✅ explicit
//                                         nestedScrollEnabled={true} // ✅ fixes Android nested scroll touch block
//                                         keyboardShouldPersistTaps="handled" // ✅ taps work even if keyboard open
//                                         renderItem={({ item }) => {
//                                             const url = item?.userRecording || item?.url || item?.recordingUrl || "";
//                                             return (
//                                                 <TouchableOpacity
//                                                     activeOpacity={0.7}
//                                                     onPress={() => {
//                                                         if (!url) return;
//                                                         setRecordingModal(false);
//                                                         setCurrentUrl(url);
//                                                         setAudioPaused(false);
//                                                         setPlayerModal(true);
//                                                     }}
//                                                     style={{ paddingVertical: 10 }}
//                                                 >
//                                                     <Text style={{ color: "#fff" }}>
//                                                         🎧 {item?.createdAt || "Recording"}
//                                                     </Text>
//                                                     <Text style={{ color: "#007BFF", marginTop: 4 }}>Play Audio</Text>
//                                                 </TouchableOpacity>
//                                             );
//                                         }}
//                                     />
//                                 )}

//                                 <TouchableOpacity
//                                     activeOpacity={0.7}
//                                     onPress={() => setRecordingModal(false)}
//                                     style={{
//                                         marginTop: 20,
//                                         padding: 12,
//                                         backgroundColor: "#2563eb",
//                                         borderRadius: 10,
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Text style={{ color: "#fff" }}>Close</Text>
//                                 </TouchableOpacity>
//                             </>
//                         )}

//                         {/* Player Modal */}
//                         {playerModal && (
//                             <>
//                                 {currentUrl ? (
//                                     <Video
//                                         key={currentUrl}
//                                         source={{ uri: currentUrl }}
//                                         audioOnly={true}
//                                         paused={audioPaused}
//                                         style={{ width: 0, height: 0 }}
//                                         mixWithOthers={false}
//                                         ignoreSilentSwitch="ignore"
//                                         playInBackground={false}
//                                         playWhenInactive={false}
//                                         onError={(e) => console.log("❌ Video error:", e)}
//                                     />
//                                 ) : null}

//                                 <Text style={{ color: "#fff", fontWeight: "700", fontSize: 18 }}>Recording Audio</Text>
//                                 <Text style={{ color: "#fff", marginTop: 5, fontSize: 14 }}>Audio Loaded ✅</Text>

//                                 <TouchableOpacity
//                                     activeOpacity={0.7}
//                                     onPress={() => setAudioPaused((prev) => !prev)}
//                                     style={{
//                                         marginTop: 20,
//                                         padding: 12,
//                                         backgroundColor: "#2563eb",
//                                         borderRadius: 10,
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Text style={{ color: "#fff" }}>{audioPaused ? "Resume" : "Pause"}</Text>
//                                 </TouchableOpacity>

//                                 {/* <TouchableOpacity
//                                     activeOpacity={0.7}
//                                     onPress={async () => {
//                                         try {
//                                             // 1. Stop video properly
//                                             setAudioPaused(true);

//                                             // 2. Remove video component immediately
//                                             setCurrentUrl("");
//                                             setPlayerModal(false);

//                                             // 3. Small delay to allow unmount
//                                             setTimeout(() => {
//                                                 try {
//                                                     // 4. FORCE Jitsi to reinitialize audio
//                                                     AudioMode?.setAudioMode?.({
//                                                         allowsRecordingIOS: true,
//                                                         playsInSilentModeIOS: true,
//                                                         interruptionModeIOS: 1,
//                                                         shouldDuckAndroid: false,
//                                                     });

//                                                     AudioMode?.updateDeviceList?.();
//                                                 } catch (err) {
//                                                     console.log("Restore audio error:", err);
//                                                 }
//                                             }, 300);
//                                         } catch (e) {
//                                             console.log("Close error:", e);
//                                         }
//                                     }}
//                                     style={{
//                                         marginTop: 10,
//                                         padding: 12,
//                                         backgroundColor: "#222",
//                                         borderRadius: 10,
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Text style={{ color: "#fff" }}>Stop & Close</Text>
//                                 </TouchableOpacity> */}
//                                 <TouchableOpacity
//                                     activeOpacity={0.7}
//                                     onPress={() => {
//                                         setAudioPaused(true);
//                                         setCurrentUrl("");
//                                         setPlayerModal(false);

//                                         setTimeout(() => {
//                                             try {
//                                                 AudioMode?.updateDeviceList?.();
//                                             } catch {}
//                                         }, 300);
//                                     }}
//                                     style={{
//                                         marginTop: 10,
//                                         padding: 12,
//                                         backgroundColor: "#222",
//                                         borderRadius: 10,
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Text style={{ color: "#fff" }}>Stop & Close</Text>
//                                 </TouchableOpacity>
//                             </>
//                         )}

//                         {/* Password Modal */}
//                         {passwordModal && (
//                             <>
//                                 <Text style={{ color: "#fff", fontSize: 18 }}>Change Password</Text>

//                                 <TextInput
//                                     placeholder="Current Password"
//                                     placeholderTextColor="#777"
//                                     secureTextEntry
//                                     value={currentPassword}
//                                     onChangeText={setCurrentPassword}
//                                     style={{
//                                         marginTop: 10,
//                                         borderWidth: 1,
//                                         borderColor: "#333",
//                                         padding: 10,
//                                         color: "#fff",
//                                     }}
//                                 />

//                                 <TextInput
//                                     placeholder="New Password"
//                                     placeholderTextColor="#777"
//                                     secureTextEntry
//                                     value={newPassword}
//                                     onChangeText={setNewPassword}
//                                     style={{
//                                         marginTop: 10,
//                                         borderWidth: 1,
//                                         borderColor: "#333",
//                                         padding: 10,
//                                         color: "#fff",
//                                     }}
//                                 />

//                                 {!!passMsg && <Text style={{ color: "#fff", marginTop: 10 }}>{passMsg}</Text>}

//                                 <TouchableOpacity
//                                     activeOpacity={0.7}
//                                     onPress={handleChangePassword}
//                                     style={{
//                                         marginTop: 20,
//                                         padding: 12,
//                                         backgroundColor: "#2563EA",
//                                         borderRadius: 10,
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Text style={{ color: "#fff", fontWeight: "600" }}>Update Password</Text>
//                                 </TouchableOpacity>

//                                 <TouchableOpacity
//                                     activeOpacity={0.7}
//                                     onPress={() => setPasswordModal(false)}
//                                     style={{
//                                         marginTop: 10,
//                                         padding: 12,
//                                         backgroundColor: "#222",
//                                         borderRadius: 10,
//                                         alignItems: "center",
//                                     }}
//                                 >
//                                     <Text style={{ color: "#fff" }}>Close</Text>
//                                 </TouchableOpacity>
//                             </>
//                         )}
//                     </View>
//                 </View>
//             )}
//         </JitsiScreen>
//     );
// };

// export default withSafeAreaInsets(CarMode);

import React, { useEffect, useState, useRef } from "react";
import { View, ViewStyle, BackHandler, Text, TouchableOpacity, TextInput, FlatList, Dimensions } from "react-native";
import Orientation from "react-native-orientation-locker";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import JitsiScreen from "../../../../base/modal/components/JitsiScreen";
import LoadingIndicator from "../../../../base/react/components/native/LoadingIndicator";
import TintedView from "../../../../base/react/components/native/TintedView";
import { isLocalVideoTrackDesktop } from "../../../../base/tracks/functions.native";
import { setPictureInPictureEnabled } from "../../../../mobile/picture-in-picture/functions";
import { setIsCarmode } from "../../../../video-layout/actions";
import { isConnecting } from "../../functions";
import { SafeAreaView } from "react-native-safe-area-context";
import { getLocalParticipant } from "../../../../base/participants/functions";
import { StatusBar, NativeModules } from "react-native";
import Sound from "react-native-sound";

import CarModeFooter from "./CarModeFooter";
import MicrophoneButton from "./MicrophoneButton";
import TitleBar from "./TitleBar";
import styles from "./styles";

import { hangup } from "../../../../base/connection/actions.native";
import { appNavigate } from "../../../../app/actions.native";

const { AudioMode } = NativeModules;
const { width, height } = Dimensions.get("window");

Sound.setCategory("Playback");

const CarMode = (): JSX.Element => {
    const dispatch = useDispatch();
    const connecting = useSelector(isConnecting);
    const isSharing = useSelector(isLocalVideoTrackDesktop);
    const local = useSelector(getLocalParticipant);

    const username = (local?.name && local.name.trim()) || (local?.displayName && local.displayName.trim()) || "";

    const API_BASE = "https://backend.konvoxa.com";

    const [adminMsg, setAdminMsg] = useState("");
    const [recordingModal, setRecordingModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [playerModal, setPlayerModal] = useState(false);

    const [recordings, setRecordings] = useState<any[]>([]);
    const [recordingLoading, setRecordingLoading] = useState(false);

    const [audioPaused, setAudioPaused] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passMsg, setPassMsg] = useState("");

    const soundRef = useRef<Sound | null>(null);

    /* ---------------- RECORDINGS ---------------- */

    const fetchRecordings = async () => {
        try {
            setRecordingLoading(true);
            const res = await fetch(`${API_BASE}/api/users/getRecording?username=${encodeURIComponent(username)}`);
            const data = await res.json();

            if (data?.success) {
                setRecordings(data?.recordings || data?.data || []);
            } else {
                setRecordings([]);
            }
        } catch {
            setRecordings([]);
        } finally {
            setRecordingLoading(false);
        }
    };

    const playSound = (url: string) => {
        if (soundRef.current) {
            soundRef.current.stop();
            soundRef.current.release();
            soundRef.current = null;
        }

        const sound = new Sound(url, "", (error) => {
            if (error) {
                console.log("❌ Failed to load sound", error);
                return;
            }

            sound.play((success) => {
                if (!success) {
                    console.log("❌ Playback failed");
                }
                sound.release();
                soundRef.current = null;
                setPlayerModal(false);
            });
        });

        soundRef.current = sound;
        setAudioPaused(false);
    };

    const stopAndClose = () => {
        if (soundRef.current) {
            soundRef.current.stop(() => {
                soundRef.current?.release();
                soundRef.current = null;
            });
        }

        setAudioPaused(false);
        setPlayerModal(false);

        setTimeout(() => {
            try {
                AudioMode?.updateDeviceList?.();
            } catch {}
        }, 200);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            setPassMsg("⚠️ Please fill both passwords");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/users/changePassFromWeb`, {
                method: "PUT", // ✅ IMPORTANT
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (data?.success) {
                // alert("✅ Password changed successfully!");
                setPassMsg("✅ Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setPasswordModal(false);
            } else {
                setPassMsg(data?.message || "❌ Password change failed");
            }
        } catch (error) {
            console.log("Password error:", error);
            setPassMsg("❌ Server error");
        }
    };

    /* ---------------- LIFECYCLE ---------------- */

    useEffect(() => {
        dispatch(setIsCarmode(true));
        setPictureInPictureEnabled(false);
        Orientation.lockToPortrait();

        const onBackPress = () => {
            dispatch(hangup());
            dispatch(appNavigate(undefined));
            return true;
        };

        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => {
            backHandler.remove();
            Orientation.unlockAllOrientations();
            dispatch(setIsCarmode(false));
            if (!isSharing) setPictureInPictureEnabled(true);

            if (soundRef.current) {
                soundRef.current.stop();
                soundRef.current.release();
                soundRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const fetchAdminDetails = async () => {
            try {
                const API_BASE = "https://backend.konvoxa.com";

                const res = await fetch(`${API_BASE}/api/users/adminDetail?username=${encodeURIComponent(username)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                console.log("✅ API response:", data);
                setAdminMsg(data?.message || "");
            } catch (err) {
                console.log("❌ Admin detail API error:", err);
            }
        };

        fetchAdminDetails();
    }, []);

    /* ================= UI ================= */

    return (
        <JitsiScreen style={styles.conference}>
            <StatusBar backgroundColor="#007BFF" barStyle="light-content" />

            {connecting && (
                <TintedView>
                    <LoadingIndicator />
                </TintedView>
            )}

            <SafeAreaView edges={["top"]} style={styles.titleBarSafeViewColor as ViewStyle}>
                <View style={styles.titleBar as ViewStyle}>
                    <TitleBar />
                </View>
            </SafeAreaView>

            <View style={[styles.body as ViewStyle, { position: "relative", overflow: "visible" }]}>
                <View style={styles.footerInsideBody as ViewStyle}>
                    <CarModeFooter
                        onOpenRecording={() => {
                            setRecordingModal(true);
                            fetchRecordings();
                        }}
                        onOpenPassword={() => setPasswordModal(true)}
                    />
                </View>

                <View style={styles.microphoneContainer as ViewStyle}>
                    <MicrophoneButton />
                </View>
            </View>

            {/* 🔥 ADMIN MESSAGE — OUTSIDE BODY */}
            {!!adminMsg && (
                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        alignItems: "center",
                        zIndex: 8000,
                        elevation: 8000,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#000000",
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            // borderRadius: 14,
                            // borderWidth: 1,
                            // borderColor: "#2563eb",
                            width: "100%",
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontSize: 15,
                                fontWeight: "700",
                            }}
                        >
                            {adminMsg ?? "fksndknf"}
                        </Text>
                    </View>
                </View>
            )}

            {(recordingModal || passwordModal || playerModal) && (
                <View
                    pointerEvents="box-none"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        elevation: 9999,
                    }}
                >
                    <View
                        pointerEvents="auto"
                        style={{
                            backgroundColor: "#111",
                            borderRadius: 14,
                            padding: 16,
                            width: width - 32,
                            maxHeight: height * 0.7,
                        }}
                    >
                        {recordingModal && (
                            <>
                                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Recordings</Text>

                                <FlatList
                                    style={{ marginTop: 12 }}
                                    data={recordings}
                                    keyExtractor={(_, i) => String(i)}
                                    renderItem={({ item }) => {
                                        const url = item?.userRecording || item?.url || item?.recordingUrl || "";

                                        return (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (!url) return;
                                                    setRecordingModal(false);
                                                    setPlayerModal(true);
                                                    playSound(url);
                                                }}
                                                style={{ paddingVertical: 10 }}
                                            >
                                                <Text style={{ color: "#fff" }}>
                                                    🎧 {item?.createdAt || "Recording"}
                                                </Text>
                                                <Text style={{ color: "#007BFF", marginTop: 4 }}>Play Audio</Text>
                                            </TouchableOpacity>
                                        );
                                    }}
                                />
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setRecordingModal(false)}
                                    style={{
                                        marginTop: 20,
                                        padding: 12,
                                        backgroundColor: "#2563eb",
                                        borderRadius: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {playerModal && (
                            <>
                                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Recording Audio</Text>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (!soundRef.current) return;

                                        if (audioPaused) {
                                            soundRef.current.play();
                                            setAudioPaused(false);
                                        } else {
                                            soundRef.current.pause();
                                            setAudioPaused(true);
                                        }
                                    }}
                                    style={{
                                        marginTop: 20,
                                        padding: 12,
                                        backgroundColor: "#2563eb",
                                        borderRadius: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>{audioPaused ? "Resume" : "Pause"}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={stopAndClose}
                                    style={{
                                        marginTop: 10,
                                        padding: 12,
                                        backgroundColor: "#222",
                                        borderRadius: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>Stop & Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                        {/* Password Modal */}
                        {passwordModal && (
                            <>
                                <Text style={{ color: "#fff", fontSize: 18 }}>Change Password</Text>

                                <TextInput
                                    placeholder="Current Password"
                                    placeholderTextColor="#777"
                                    secureTextEntry
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    style={{
                                        marginTop: 10,
                                        borderWidth: 1,
                                        borderColor: "#333",
                                        padding: 10,
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
                                        padding: 10,
                                        color: "#fff",
                                    }}
                                />

                                {!!passMsg && <Text style={{ color: "#fff", marginTop: 10 }}>{passMsg}</Text>}

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={handleChangePassword}
                                    style={{
                                        marginTop: 20,
                                        padding: 12,
                                        backgroundColor: "#2563EA",
                                        borderRadius: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "600" }}>Update Password</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setPasswordModal(false)}
                                    style={{
                                        marginTop: 10,
                                        padding: 12,
                                        backgroundColor: "#222",
                                        borderRadius: 10,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#fff" }}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            )}
        </JitsiScreen>
    );
};

export default withSafeAreaInsets(CarMode);
