// import React from "react";
// import { Text, View, ViewStyle, TouchableOpacity, Image } from "react-native";
// import { connect } from "react-redux";

// import { IReduxState } from "../../../../app/types";
// import { getConferenceName } from "../../../../base/conference/functions";
// import { getLocalParticipant } from "../../../../base/participants/functions";
// const volumeIcon = require("./assets/carmode/volume.png");
// const phoneIcon = require("./assets/carmode/phone.png");
// // const userIcon = require("./assets/carmode/user.png");
// // const powerOffIcon = require("./assets/carmode/power-off.png");
// import EndMeetingButton from "./EndMeetingButton";
// import styles from "./styles";
// import SoundDeviceButton from "./SoundDeviceButton";
// interface IProps {
//     _meetingName: string;
//     _username: string;
//     onOpenRecording: () => void;
//     onOpenPassword: () => void;
//     onOpenAdmin?: () => void; // ✅ NEW
// }

// const userIcon = require("./assets/carmode/user.png");
// const powerOffIcon = require("./assets/carmode/power-off.png");

// const CarModeFooter = (props: IProps): JSX.Element => {
//     return (
//         <View style={styles.bottomContainer as ViewStyle}>
//             <View style={styles.actionRow as ViewStyle}>
//                 <SoundDeviceButton volumeIcon={volumeIcon} phoneIcon={phoneIcon} />
//                 {/* Password */}
//                 <TouchableOpacity
//                     style={styles.actionCard as ViewStyle}
//                     activeOpacity={0.8}
//                     onPress={props.onOpenPassword}
//                 >
//                     <Image source={userIcon} style={{ width: 45, height: 45, marginBottom: 6 }} resizeMode="contain" />
//                     <Text style={styles.actionText}>Password</Text>
//                 </TouchableOpacity>

//                 {/* Recordings */}
//                 <TouchableOpacity
//                     style={styles.actionCard as ViewStyle}
//                     activeOpacity={0.8}
//                     onPress={props.onOpenRecording}
//                 >
//                     <Text style={styles.actionIcon}>▶️</Text>
//                     <Text style={styles.actionText}>Recordings</Text>
//                 </TouchableOpacity>

//                 {/* Exit */}
//                 <View style={styles.actionCard as ViewStyle}>
//                     <Image
//                         source={powerOffIcon}
//                         style={{ width: 45, height: 45, marginBottom: 6 }}
//                         resizeMode="contain"
//                     />
//                     <Text style={styles.actionText}>Exit</Text>

//                     <View style={styles.hiddenActionButton as ViewStyle}>
//                         <EndMeetingButton />
//                     </View>
//                 </View>
//             </View>
//         </View>
//     );
// };

// function _mapStateToProps(state: IReduxState) {
//     const local = getLocalParticipant(state);

//     return {
//         _meetingName: getConferenceName(state),
//         _username: local?.name || "",
//     };
// }

// export default connect(_mapStateToProps)(CarModeFooter);

import React from "react";
import { Text, View, ViewStyle, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";

import { IReduxState } from "../../../../app/types";
import { getConferenceName } from "../../../../base/conference/functions";
import { getLocalParticipant } from "../../../../base/participants/functions";
const volumeIcon = require("./assets/carmode/volume.png");
const phoneIcon = require("./assets/carmode/phone.png");
// const userIcon = require("./assets/carmode/user.png");
// const powerOffIcon = require("./assets/carmode/power-off.png");
import EndMeetingButton from "./EndMeetingButton";
import styles from "./styles";
import SoundDeviceButton from "./SoundDeviceButton";
interface IProps {
    _meetingName: string;
    _username: string;
    onOpenRecording: () => void;
    onOpenPassword: () => void;
    onOpenAdmin?: () => void; // ✅ NEW
}

const userIcon = require("./assets/carmode/user.png");
const powerOffIcon = require("./assets/carmode/power-off.png");

const CarModeFooter = (props: IProps): JSX.Element => {
    return (
        <View style={styles.bottomContainer as ViewStyle}>
            <View style={styles.actionRow as ViewStyle}>
                <SoundDeviceButton volumeIcon={volumeIcon} phoneIcon={phoneIcon} />
                {/* Password */}
                <TouchableOpacity
                    style={styles.actionCard as ViewStyle}
                    activeOpacity={0.8}
                    onPress={props.onOpenPassword}
                >
                    <Image source={userIcon} style={{ width: 45, height: 45, marginBottom: 6 }} resizeMode="contain" />
                    <Text style={styles.actionText}>Password</Text>
                </TouchableOpacity>

                {/* Recordings */}
                <TouchableOpacity
                    style={styles.actionCard as ViewStyle}
                    activeOpacity={0.8}
                    onPress={props.onOpenRecording}
                >
                    <Text style={styles.actionIcon}>▶️</Text>
                    <Text style={styles.actionText}>Recordings</Text>
                </TouchableOpacity>

                {/* Exit */}
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
