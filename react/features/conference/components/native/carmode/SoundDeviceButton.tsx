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
import React, { useCallback, useMemo } from "react";
import { Text, ViewStyle, TouchableOpacity, Image, NativeModules } from "react-native";
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

  // ✅ local participant id
  const localParticipant = useSelector((state: IReduxState) =>
    getLocalParticipant(state as any)
  );

  const localParticipantId = localParticipant?.id;

  // ✅ devices list from redux (same as dialog)
  const devices = useSelector((state: IReduxState) => {
    return (state as any)["features/mobile/audio-mode"]?.devices || [];
  });

  // ✅ current selected device from redux list
  const currentDeviceType = useMemo(() => {
    const selected = devices.find((d: any) => d.selected);

    // fallback
    return selected?.type || "SPEAKER";
  }, [devices]);

  const isSpeaker = useMemo(() => currentDeviceType === "SPEAKER", [currentDeviceType]);

  const toggleSpeaker = useCallback(() => {
    if (!localParticipantId) {
      console.log("❌ No localParticipantId found");
      return;
    }

    // ✅ next route
    const nextRoute = isSpeaker ? "EARPIECE" : "SPEAKER";

    // ✅ 1) Redux update (for UI state)
    dispatch({
      type: "LOCAL_AUDIO_ROUTE_CHANGED",
      participantId: localParticipantId,
      route: nextRoute
    });

    // ✅ 2) REAL native audio route switch
    try {
      console.log("🔥 AudioMode.setAudioDevice:", nextRoute);
      AudioMode.setAudioDevice(nextRoute);
    } catch (err) {
      console.log("❌ AudioMode.setAudioDevice error:", err);
    }

    // ✅ 3) refresh device list (optional but best)
    try {
      AudioMode.updateDeviceList?.();
    } catch (err) {
      console.log("❌ AudioMode.updateDeviceList error:", err);
    }
  }, [dispatch, isSpeaker, localParticipantId]);

  return (
    <TouchableOpacity
      style={styles.actionCard as ViewStyle}
      activeOpacity={0.8}
      onPress={toggleSpeaker}
    >
      <Image
        source={isSpeaker ? volumeIcon : phoneIcon}
        style={{ width: 45, height: 45, marginBottom: 6 }}
        resizeMode="contain"
      />

      <Text style={styles.actionText}>
        {isSpeaker ? "Speaker" : "Phone"}
      </Text>
    </TouchableOpacity>
  );
};

export default SoundDeviceButton;


