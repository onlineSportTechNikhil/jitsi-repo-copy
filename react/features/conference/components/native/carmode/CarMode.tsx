// import React, { useEffect, useState } from "react";
// import { View, ViewStyle, BackHandler, Text } from "react-native";
// import Orientation from "react-native-orientation-locker";
// import { withSafeAreaInsets } from "react-native-safe-area-context";
// import { useDispatch, useSelector } from "react-redux";

// import JitsiScreen from "../../../../base/modal/components/JitsiScreen";
// import LoadingIndicator from "../../../../base/react/components/native/LoadingIndicator";
// import TintedView from "../../../../base/react/components/native/TintedView";
// import { isLocalVideoTrackDesktop } from "../../../../base/tracks/functions.native";
// import { setPictureInPictureEnabled } from "../../../../mobile/picture-in-picture/functions";
// import { setIsCarmode } from "../../../../video-layout/actions";
// import ConferenceTimer from "../../ConferenceTimer";
// import { isConnecting } from "../../functions";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { getLocalParticipant } from "../../../../base/participants/functions";
// import { StatusBar } from "react-native";

// import CarModeFooter from "./CarModeFooter";
// import MicrophoneButton from "./MicrophoneButton";
// import TitleBar from "./TitleBar";
// import styles from "./styles";

// import { hangup } from "../../../../base/connection/actions.native";
// import { appNavigate } from "../../../../app/actions.native";

// const CarMode = (): JSX.Element => {
//     const dispatch = useDispatch();
//     const connecting = useSelector(isConnecting);
//     const isSharing = useSelector(isLocalVideoTrackDesktop);

//     // ✅ REAL username (Admin_nikhil)
//     const local = useSelector(getLocalParticipant);
//     const username =
//         typeof local?.name === "string" && local?.name.trim()
//             ? local.name.trim()
//             : "";

//     const API_BASE = "https://backend.konvoxa.com";

//     const [adminMsg, setAdminMsg] = useState("");

//     const fetchAdminDetail = async () => {
//         try {
//             console.log("✅ username used in API:", username);

//             const res = await fetch(
//                 `${API_BASE}/api/users/adminDetail?username=${encodeURIComponent(username)}`,
//                 {
//                     method: "GET",
//                     headers: { "Content-Type": "application/json" }
//                 }
//             );

//             const data = await res.json();
//             console.log("✅ adminDetail response:", data);

//             if (data?.success) {
//                 setAdminMsg(data?.message || "");
//             } else {
//                 setAdminMsg("");
//             }
//         } catch (err) {
//             console.log("❌ adminDetail API error:", err);
//             setAdminMsg("");
//         }
//     };

//     useEffect(() => {
//         dispatch(setIsCarmode(true));
//         setPictureInPictureEnabled(false);
//         Orientation.lockToPortrait();

//         // ✅ username jab ready ho tabhi API call
//         if (username) {
//             fetchAdminDetail();
//         }

//         const onBackPress = () => {
//             dispatch(hangup());
//             dispatch(appNavigate(undefined));
//             return true;
//         };

//         const backHandler = BackHandler.addEventListener(
//             "hardwareBackPress",
//             onBackPress
//         );

//         return () => {
//             backHandler.remove();
//             Orientation.unlockAllOrientations();
//             dispatch(setIsCarmode(false));

//             if (!isSharing) {
//                 setPictureInPictureEnabled(true);
//             }
//         };
//     }, [username]);

//     return (
//         <JitsiScreen style={styles.conference}>
//              <StatusBar backgroundColor="#007BFF" barStyle="light-content" />

//             {connecting && (
//                 <TintedView>
//                     <LoadingIndicator />
//                 </TintedView>
//             )}

//             {/* ✅ TOP HEADER */}
//             <SafeAreaView edges={["top"]} style={styles.titleBarSafeViewColor as ViewStyle}>
//                 <View style={styles.titleBar as ViewStyle}>
//                     <TitleBar />
//                 </View>
//                 {/* <ConferenceTimer textStyle={styles.roomTimer} /> */}
//             </SafeAreaView>

//             {/* ✅ BODY */}
//             <View style={styles.body as ViewStyle}>
//                 <View style={styles.footerInsideBody as ViewStyle}>
//                     <CarModeFooter />
//                 </View>

//                 <View style={styles.microphoneContainer as ViewStyle}>
//                     <MicrophoneButton />
//                 </View>

//                 {/* ✅ BLACK STRIP MESSAGE */}
//                 <View style={styles.adminMessageBar as ViewStyle}>
//                     <Text style={styles.adminMessageText}>
//                         {adminMsg?.trim() ? adminMsg : "Hello Ji 👋"}
//                     </Text>
//                 </View>
//             </View>
//         </JitsiScreen>
//     );
// };

// export default withSafeAreaInsets(CarMode);
import React, { useEffect, useState } from "react";
import { View, ViewStyle, BackHandler, Text } from "react-native";
import Orientation from "react-native-orientation-locker";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import JitsiScreen from "../../../../base/modal/components/JitsiScreen";
import LoadingIndicator from "../../../../base/react/components/native/LoadingIndicator";
import TintedView from "../../../../base/react/components/native/TintedView";
import { isLocalVideoTrackDesktop } from "../../../../base/tracks/functions.native";
import { setPictureInPictureEnabled } from "../../../../mobile/picture-in-picture/functions";
import { setIsCarmode } from "../../../../video-layout/actions";
import ConferenceTimer from "../../ConferenceTimer";
import { isConnecting } from "../../functions";
import { SafeAreaView } from "react-native-safe-area-context";

import { getLocalParticipant } from "../../../../base/participants/functions";
import { StatusBar } from "react-native";

import CarModeFooter from "./CarModeFooter";
import MicrophoneButton from "./MicrophoneButton";
import TitleBar from "./TitleBar";
import styles from "./styles";

import { hangup } from "../../../../base/connection/actions.native";
import { appNavigate } from "../../../../app/actions.native";

const CarMode = (): JSX.Element => {
    const dispatch = useDispatch();
    const connecting = useSelector(isConnecting);
    const isSharing = useSelector(isLocalVideoTrackDesktop);

    // ✅ REAL username (Admin_nikhil)
    const local = useSelector(getLocalParticipant);
    const username = typeof local?.name === "string" && local?.name.trim() ? local.name.trim() : "";

    const API_BASE = "https://backend.konvoxa.com";

    const [adminMsg, setAdminMsg] = useState("");

    const fetchAdminDetail = async () => {
        try {
            console.log("✅ username used in API:", username);

            const res = await fetch(`${API_BASE}/api/users/adminDetail?username=${encodeURIComponent(username)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            console.log("✅ adminDetail response:", data);

            if (data?.success) {
                setAdminMsg(data?.message || "");
            } else {
                setAdminMsg("");
            }
        } catch (err) {
            console.log("❌ adminDetail API error:", err);
            setAdminMsg("");
        }
    };

    useEffect(() => {
        dispatch(setIsCarmode(true));
        setPictureInPictureEnabled(false);
        Orientation.lockToPortrait();

        // ✅ username jab ready ho tabhi API call
        if (username) {
            fetchAdminDetail();
        }

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

            if (!isSharing) {
                setPictureInPictureEnabled(true);
            }
        };
    }, [username]);

    return (
        <JitsiScreen style={styles.conference}>
            <StatusBar backgroundColor="#007BFF" barStyle="light-content" />

            {connecting && (
                <TintedView>
                    <LoadingIndicator />
                </TintedView>
            )}

            {/* ✅ TOP HEADER */}
            <SafeAreaView edges={["top"]} style={styles.titleBarSafeViewColor as ViewStyle}>
                <View style={styles.titleBar as ViewStyle}>
                    <TitleBar />
                </View>
                {/* <ConferenceTimer textStyle={styles.roomTimer} /> */}
            </SafeAreaView>

            {/* ✅ BODY */}
            <View style={styles.body as ViewStyle}>
                <View style={styles.footerInsideBody as ViewStyle}>
                    <CarModeFooter />
                </View>

                <View style={styles.microphoneContainer as ViewStyle}>
                    <MicrophoneButton />
                </View>

                {/* ✅ BLACK STRIP MESSAGE */}
            </View>
            <View style={styles.adminMessageBar as ViewStyle}>
                <Text style={styles.adminMessageText}>{adminMsg?.trim() ? adminMsg : "Hello Ji 👋"}</Text>
            </View>
        </JitsiScreen>
    );
};

export default withSafeAreaInsets(CarMode);
