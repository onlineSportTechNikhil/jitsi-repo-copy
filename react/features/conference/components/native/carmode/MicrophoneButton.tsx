import React, { useCallback, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
    ACTION_SHORTCUT_PRESSED as PRESSED,
    ACTION_SHORTCUT_RELEASED as RELEASED,
    createShortcutEvent,
} from "../../../../analytics/AnalyticsEvents";
import { sendAnalytics } from "../../../../analytics/functions";
import { IReduxState } from "../../../../app/types";
import { AUDIO_MUTE_BUTTON_ENABLED } from "../../../../base/flags/constants";
import { getFeatureFlag } from "../../../../base/flags/functions";
import Icon from "../../../../base/icons/components/Icon";
import { IconMic, IconMicSlash } from "../../../../base/icons/svg";
import { MEDIA_TYPE } from "../../../../base/media/constants";
import { isLocalTrackMuted } from "../../../../base/tracks/functions.native";
import { isAudioMuteButtonDisabled } from "../../../../toolbox/functions.any";
import { muteLocal } from "../../../../video-menu/actions.native";

import styles from "./styles";

const LONG_PRESS = "long.press";

const MicrophoneButton = (): JSX.Element | null => {
    const dispatch = useDispatch();

    const audioMuted = useSelector((state: IReduxState) =>
        isLocalTrackMuted(state["features/base/tracks"], MEDIA_TYPE.AUDIO),
    );

    const disabled = useSelector(isAudioMuteButtonDisabled);
    const enabledFlag = useSelector((state: IReduxState) => getFeatureFlag(state, AUDIO_MUTE_BUTTON_ENABLED, true));

    const [isTalking, setIsTalking] = useState(false);

    if (!enabledFlag) {
        return null;
    }

    /**
     * 🎤 INSTANT START TALKING
     * → fires immediately when finger touches button
     */
    const onPressIn = useCallback(() => {
        if (disabled || !audioMuted) {
            return;
        }

        setIsTalking(true);
        sendAnalytics(createShortcutEvent("push.to.talk", PRESSED, {}, LONG_PRESS));

        // ✅ UNMUTE IMMEDIATELY (NO DELAY)
        dispatch(muteLocal(false, MEDIA_TYPE.AUDIO));
    }, [audioMuted, disabled]);

    /**
     * 🔇 STOP TALKING
     * → fires immediately when finger released
     */
    const onPressOut = useCallback(() => {
        if (!isTalking) {
            return;
        }

        setIsTalking(false);
        sendAnalytics(createShortcutEvent("push.to.talk", RELEASED, {}, LONG_PRESS));

        // ✅ MUTE BACK
        dispatch(muteLocal(true, MEDIA_TYPE.AUDIO));
    }, [isTalking]);

    return (
        <TouchableOpacity onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={0.9}>
            <View
                style={
                    [styles.microphoneStyles.container, !audioMuted && styles.microphoneStyles.unmuted] as ViewStyle[]
                }
            >
                <View style={styles.microphoneStyles.iconContainer as ViewStyle}>
                    <Icon src={audioMuted ? IconMicSlash : IconMic} style={styles.microphoneStyles.icon} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default MicrophoneButton;
