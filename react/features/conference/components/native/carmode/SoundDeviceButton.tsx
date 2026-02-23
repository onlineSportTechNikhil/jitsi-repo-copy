// import React, { useCallback } from 'react';
// import { useDispatch } from 'react-redux';

// import { openSheet } from '../../../../base/dialog/actions';
// import Button from '../../../../base/ui/components/native/Button';
// import { BUTTON_TYPES } from '../../../../base/ui/constants.native';
// import AudioRoutePickerDialog from '../../../../mobile/audio-mode/components/AudioRoutePickerDialog';

// import AudioIcon from './AudioIcon';
// import styles from './styles';

// /**
//  * Button for selecting sound device in carmode.
//  *
//  * @returns {JSX.Element} - The sound device button.
//  */
// const SelectSoundDevice = (): JSX.Element => {
//     const dispatch = useDispatch();

//     const onSelect = useCallback(() =>
//         dispatch(openSheet(AudioRoutePickerDialog))
//     , [ dispatch ]);

//     return (
//         <Button
//             accessibilityLabel = 'carmode.actions.selectSoundDevice'
//             icon = { AudioIcon }
//             labelKey = 'carmode.actions.selectSoundDevice'
//             onClick = { onSelect }
//             style = { styles.soundDeviceButton }
//             type = { BUTTON_TYPES.SECONDARY } />
//     );
// };

// export default SelectSoundDevice;

/*------------------------------*/

// import React, { useCallback, useMemo } from "react";
// import { Text, ViewStyle, TouchableOpacity, Image, NativeModules } from "react-native";
// import { useDispatch, useSelector } from "react-redux";

// import { IReduxState } from "../../../../app/types";
// import styles from "./styles";
// import { getLocalParticipant } from "../../../../base/participants/functions";

// const { AudioMode } = NativeModules;

// interface IProps {
//     volumeIcon: any;
//     phoneIcon: any;
// }

// const SoundDeviceButton = ({ volumeIcon, phoneIcon }: IProps): JSX.Element => {
//     const dispatch = useDispatch();

//     // ✅ local participant id
//     const localParticipant = useSelector((state: IReduxState) => getLocalParticipant(state as any));

//     const localParticipantId = localParticipant?.id;

//     // ✅ devices list from redux (same as dialog)
//     const devices = useSelector((state: IReduxState) => {
//         return (state as any)["features/mobile/audio-mode"]?.devices || [];
//     });

//     // ✅ current selected device from redux list
//     const currentDeviceType = useMemo(() => {
//         const selected = devices.find((d: any) => d.selected);

//         // fallback
//         return selected?.type || "SPEAKER";
//     }, [devices]);

//     const isSpeaker = useMemo(() => currentDeviceType === "SPEAKER", [currentDeviceType]);

//     const toggleSpeaker = useCallback(() => {
//         if (!localParticipantId) {
//             console.log("❌ No localParticipantId found");
//             return;
//         }

//         // ✅ next route
//         const nextRoute = isSpeaker ? "EARPIECE" : "SPEAKER";

//         // ✅ 1) Redux update (for UI state)
//         dispatch({
//             type: "LOCAL_AUDIO_ROUTE_CHANGED",
//             participantId: localParticipantId,
//             route: nextRoute,
//         });

//         // ✅ 2) REAL native audio route switch
//         try {
//             console.log("🔥 AudioMode.setAudioDevice:", nextRoute);
//             AudioMode.setAudioDevice(nextRoute);
//         } catch (err) {
//             console.log("❌ AudioMode.setAudioDevice error:", err);
//         }

//         // ✅ 3) refresh device list (optional but best)
//         try {
//             AudioMode.updateDeviceList?.();
//         } catch (err) {
//             console.log("❌ AudioMode.updateDeviceList error:", err);
//         }
//     }, [dispatch, isSpeaker, localParticipantId]);

//     return (
//         <TouchableOpacity style={styles.actionCard as ViewStyle} activeOpacity={0.8} onPress={toggleSpeaker}>
//             <Image
//                 source={isSpeaker ? volumeIcon : phoneIcon}
//                 style={{ width: 45, height: 45, marginBottom: 6 }}
//                 resizeMode="contain"
//             />

//             <Text style={styles.actionText}>{isSpeaker ? "Speaker" : "Phone"}</Text>
//         </TouchableOpacity>
//     );
// };

// export default SoundDeviceButton;

import React, { useCallback, useEffect, useMemo } from "react";
import { Text, ViewStyle, TouchableOpacity, Image, NativeModules, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { IReduxState } from "../../../../app/types";
import styles from "./styles";
import { getLocalParticipant } from "../../../../base/participants/functions";

const { AudioMode } = NativeModules;

interface IProps {
    volumeIcon: any;
    phoneIcon: any;
}

const SoundDeviceButton = ({ volumeIcon, phoneIcon }: IProps): JSX.Element => {
    const dispatch = useDispatch();

    const localParticipant = useSelector((state: IReduxState) => getLocalParticipant(state as any));
    const localParticipantId = localParticipant?.id;

    const devices = useSelector((state: IReduxState) => {
        return (state as any)["features/mobile/audio-mode"]?.devices || [];
    });

    // 🔍 Debug: log devices on every change
    useEffect(() => {
        console.log("📱 [SoundDeviceButton] Audio devices list:", JSON.stringify(devices, null, 2));
    }, [devices]);

    const currentDeviceType = useMemo(() => {
        const selected = devices.find((d: any) => d.selected);
        console.log("🎯 [SoundDeviceButton] Selected device:", JSON.stringify(selected));
        return selected?.type || "SPEAKER";
    }, [devices]);

    const isSpeaker = useMemo(() => currentDeviceType === "SPEAKER", [currentDeviceType]);

    const toggleSpeaker = useCallback(() => {
        if (!localParticipantId) {
            console.log("❌ [SoundDeviceButton] No localParticipantId found");
            return;
        }

        const nextType = isSpeaker ? "EARPIECE" : "SPEAKER";

        console.log(
            `🔄 [SoundDeviceButton] Toggling from ${currentDeviceType} → ${nextType} | Platform: ${Platform.OS}`,
        );
        console.log("📋 [SoundDeviceButton] Full devices list at toggle time:", JSON.stringify(devices, null, 2));

        if (Platform.OS === "ios") {
            // iOS needs the device UID, not the type string
            const targetDevice = devices.find((d: any) => d.type === nextType);

            if (!targetDevice) {
                console.log(
                    `❌ [SoundDeviceButton] iOS: No device found with type "${nextType}". Available:`,
                    devices.map((d: any) => ({ type: d.type, uid: d.uid })),
                );
                return;
            }

            console.log("🍎 [SoundDeviceButton] iOS: calling setAudioDevice with uid:", targetDevice.uid);

            try {
                AudioMode.setAudioDevice(targetDevice.uid);
                console.log("✅ [SoundDeviceButton] iOS: setAudioDevice called successfully");
            } catch (err) {
                console.log("❌ [SoundDeviceButton] iOS: setAudioDevice error:", err);
            }
        } else {
            // Android works fine with type string
            console.log("🤖 [SoundDeviceButton] Android: calling setAudioDevice with type:", nextType);

            try {
                AudioMode.setAudioDevice(nextType);
                console.log("✅ [SoundDeviceButton] Android: setAudioDevice called successfully");
            } catch (err) {
                console.log("❌ [SoundDeviceButton] Android: setAudioDevice error:", err);
            }
        }

        // ✅ Manually update Redux devices state so admin sees the change
        // Mirror what Jitsi's native event would do
        // const updatedDevices = devices.map((d: any) => ({
        //     ...d,
        //     selected: d.type === nextType,
        // }));

        // dispatch({
        //     type: "AUDIO_DEVICE_CHANGED",
        //     devices: updatedDevices,
        // });

        dispatch({
            type: "LOCAL_AUDIO_ROUTE_CHANGED",
            participantId: localParticipantId,
            route: nextType,
        });
        // Refresh device list so Redux state updates
        try {
            AudioMode.updateDeviceList?.();
            console.log("🔃 [SoundDeviceButton] updateDeviceList called");
        } catch (err) {
            console.log("❌ [SoundDeviceButton] updateDeviceList error:", err);
        }
    }, [devices, isSpeaker, currentDeviceType, localParticipantId]);

    console.log(`🖼️ [SoundDeviceButton] Rendering — isSpeaker: ${isSpeaker}, currentDeviceType: ${currentDeviceType}`);

    return (
        <TouchableOpacity style={styles.actionCard as ViewStyle} activeOpacity={0.8} onPress={toggleSpeaker}>
            <Image
                source={isSpeaker ? volumeIcon : phoneIcon}
                style={{ width: 45, height: 45, marginBottom: 6 }}
                resizeMode="contain"
            />
            <Text style={styles.actionText}>{isSpeaker ? "Speaker" : "Phone"}</Text>
        </TouchableOpacity>
    );
};

export default SoundDeviceButton;
