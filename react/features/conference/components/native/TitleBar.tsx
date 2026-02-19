// export default connect(_mapStateToProps)(TitleBar);
import React, { useEffect, useState } from "react";
import { hangup } from "../../../base/connection/actions.native";
import { appNavigate } from "../../../app/actions.native";
// import axios from "axios";
import { Text, View, ViewStyle, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { IReduxState } from "../../../app/types";
import { getConferenceName, getConferenceTimestamp } from "../../../base/conference/functions";
import {
    AUDIO_DEVICE_BUTTON_ENABLED,
    CONFERENCE_TIMER_ENABLED,
    TOGGLE_CAMERA_BUTTON_ENABLED,
} from "../../../base/flags/constants";
import { getFeatureFlag } from "../../../base/flags/functions";
import { isParticipantsPaneEnabled } from "../../../participants-pane/functions";
import { isRoomNameEnabled } from "../../../prejoin/functions.native";
import { isToolboxVisible } from "../../../toolbox/functions.native";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles";
import Icon from "../../../base/icons/components/Icon";
import { IconHangup } from "../../../base/icons/svg";

import { endConference } from "../../../base/conference/actions";

interface IProps {
    _audioDeviceButtonEnabled: boolean;
    _conferenceTimerEnabled: boolean;
    _createOnPress: Function;
    _isParticipantsPaneEnabled: boolean;
    _meetingName: string;
    _roomNameEnabled: boolean;
    _toggleCameraButtonEnabled: boolean;
    _visible: boolean;
}

const TitleBar = (props: IProps) => {
    const dispatch = useDispatch();
    const { _visible, _meetingName } = props;

    const [expiryText, setExpiryText] = useState("Checking subscription...");

    useEffect(() => {
        if (_meetingName) {
            fetchExpiry();
        }
    }, [_meetingName]);

    const fetchExpiry = async () => {
        try {
            const adminName = _meetingName.split(" ")[0];

            const res = await fetch(`https://backend.konvoxa.com/api/users/adminExpiry?adminName=${adminName}`);

            const data = await res.json();

            if (!data || !data.accessExpiry) {
                setExpiryText("Subscription info unavailable");
                return;
            }

            const expiry = new Date(data.accessExpiry);
            const today = new Date();

            const diffTime = expiry.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (daysLeft <= 0) {
                setExpiryText(`Expired on ${expiry.toLocaleDateString()}`);
            } else {
                setExpiryText(`Days left: ${daysLeft} (expiry: ${expiry.toLocaleDateString()})`);
            }
        } catch (e) {
            console.log("Expiry error", e);
            setExpiryText("Failed to load subscription");
        }
    };

    if (!_visible) {
        return null;
    }

    const handleHangup = () => {
        console.log("📞 End Meeting clicked");
        dispatch(hangup());
        // dispatch(endConference());
        dispatch(appNavigate(undefined));
    };

    return (
        <>
            {/* Title bar */}
            <View style={[styles.titleBarWrapper as ViewStyle, { backgroundColor: "#007bff", flexDirection: "row" }]}>
                {/* Left icon */}
                <Text style={{ fontSize: 22, color: "#fff", paddingHorizontal: 8 }}>🎧</Text>

                {/* Center Host Name */}
                {props._roomNameEnabled && (
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                textAlign: "center",
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: "600",
                            }}
                        >
                            {`Host: ${_meetingName?.split(" ")[0]}`}
                        </Text>
                    </View>
                )}

                {/* Hangup button */}
                <View style={{ width: 60, alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity
                        onPress={handleHangup}
                        activeOpacity={0.8}
                        style={{
                            width: 33,
                            height: 33,
                            borderRadius: 21,
                            backgroundColor: "#ff2d2d",
                            alignItems: "center",
                            justifyContent: "center",
                            elevation: 4,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 3,
                        }}
                    >
                        <Icon src={IconHangup} size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Subscription strip */}
            <View
                style={{
                    width: "100%",
                    backgroundColor: "#000",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 4,
                }}
            >
                <Text
                    style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "700",
                    }}
                >
                    {expiryText}
                </Text>
            </View>
        </>
    );
};

function _mapStateToProps(state: IReduxState) {
    const { hideConferenceTimer } = state["features/base/config"];
    const startTimestamp = getConferenceTimestamp(state);

    return {
        _audioDeviceButtonEnabled: getFeatureFlag(state, AUDIO_DEVICE_BUTTON_ENABLED, true),
        _conferenceTimerEnabled: Boolean(
            getFeatureFlag(state, CONFERENCE_TIMER_ENABLED, true) && !hideConferenceTimer && startTimestamp,
        ),
        _isParticipantsPaneEnabled: isParticipantsPaneEnabled(state),
        _meetingName: getConferenceName(state),
        _roomNameEnabled: isRoomNameEnabled(state),
        _toggleCameraButtonEnabled: getFeatureFlag(state, TOGGLE_CAMERA_BUTTON_ENABLED, true),
        _visible: isToolboxVisible(state),
    };
}

export default connect(_mapStateToProps)(TitleBar);
