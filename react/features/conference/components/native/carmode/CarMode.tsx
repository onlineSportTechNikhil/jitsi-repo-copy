import React, { useEffect } from "react";
import { BackHandler, View, ViewStyle } from "react-native";
import Orientation from "react-native-orientation-locker";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import JitsiScreen from "../../../../base/modal/components/JitsiScreen";
import { getLocalParticipant } from "../../../../base/participants/functions";
import LoadingIndicator from "../../../../base/react/components/native/LoadingIndicator";
import TintedView from "../../../../base/react/components/native/TintedView";
import { isLocalVideoTrackDesktop } from "../../../../base/tracks/functions.native";
import { setPictureInPictureEnabled } from "../../../../mobile/picture-in-picture/functions";
import { setIsCarmode } from "../../../../video-layout/actions";
import ConferenceTimer from "../../ConferenceTimer";
import { isConnecting } from "../../functions";

import CarModeFooter from "./CarModeFooter";
import MicrophoneButton from "./MicrophoneButton";
import TitleBar from "./TitleBar";
import styles from "./styles";

/**
 * Implements the carmode component.
 *
 * @returns { JSX.Element} - The carmode component.
 */
const CarMode = (): JSX.Element => {
    const dispatch = useDispatch();
    const connecting = useSelector(isConnecting);
    const isSharing = useSelector(isLocalVideoTrackDesktop);
    const localParticipant = useSelector(getLocalParticipant);
    const isModerator = localParticipant?.role === "moderator";

    useEffect(() => {
        console.log("🚗 [CARMODE COMPONENT] CarMode mounted");
        console.log("🚗 [CARMODE COMPONENT] isModerator:", isModerator);

        console.log("🚗 [CARMODE COMPONENT] Dispatching setIsCarmode(true)");
        dispatch(setIsCarmode(true));

        console.log("🚗 [CARMODE COMPONENT] Setting PiP to false");
        setPictureInPictureEnabled(false);

        console.log("🚗 [CARMODE COMPONENT] Locking orientation to portrait");
        Orientation.lockToPortrait();

        // TESTING: Block back button for ALL users
        const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            console.log("🚗 [CARMODE COMPONENT] Back button pressed");
            console.log("🚗 [CARMODE COMPONENT] 🔥 BLOCKING BACK FOR ALL USERS (Testing)");
            if (isModerator) {
                return false; // Allow moderators to go back
            }
            return true; // Block regular users
        });

        return () => {
            console.log("🚗 [CARMODE COMPONENT] CarMode unmounting");
            backHandler.remove();
            Orientation.unlockAllOrientations();

            // Only moderators can disable car mode on unmount
            if (isModerator) {
                dispatch(setIsCarmode(false));
            }
            if (!isSharing) {
                setPictureInPictureEnabled(true);
            }
        };
    }, [isModerator]);

    return (
        <JitsiScreen footerComponent={CarModeFooter} style={styles.conference}>
            {
                /*
                 * The activity/loading indicator goes above everything, except
                 * the toolbox/toolbars and the dialogs.
                 */
                connecting && (
                    <TintedView>
                        <LoadingIndicator />
                    </TintedView>
                )
            }
            <View pointerEvents="box-none" style={styles.titleBarSafeViewColor as ViewStyle}>
                <View style={styles.titleBar as ViewStyle}>
                    <TitleBar />
                </View>
                {/* <ConferenceTimer textStyle={styles.roomTimer} /> */}
            </View>
            <View pointerEvents="box-none" style={styles.microphoneContainer as ViewStyle}>
                <MicrophoneButton />
            </View>
        </JitsiScreen>
    );
};

export default withSafeAreaInsets(CarMode);
