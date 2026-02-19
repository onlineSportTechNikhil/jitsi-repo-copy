// import React, { useEffect, useState } from "react";
// import { Image, StyleProp, Text, View, ViewStyle } from "react-native";
// import { connect } from "react-redux";

// import { IReduxState } from "../../../../app/types";
// import { getLocalParticipant } from "../../../../base/participants/functions";

// import styles from "./styles";

// interface IProps {
//     _localUserName: string;
// }

// const TitleBar = (props: IProps): JSX.Element => {

//     // ✅ YAHI REAL USERNAME HAI (Admin_nikhil)
//     const username =
//         typeof props._localUserName === "string" && props._localUserName.trim()
//             ? props._localUserName.trim()
//             : "";

//     const [adminPhoto, setAdminPhoto] = useState<string>("");
//     const [customName, setCustomName] = useState<string>("");
//     const [helpline, setHelpline] = useState<string>("");

//     useEffect(() => {
//         if (!username) return;

//         const fetchAdminDetails = async () => {
//             try {
//                 const API_BASE = "https://backend.konvoxa.com";

//                 console.log("✅ localUserName:", props._localUserName);
//                 console.log("✅ username used in API:", username);

//                 const res = await fetch(
//                     `${API_BASE}/api/users/adminDetail?username=${encodeURIComponent(username)}`,
//                     {
//                         method: "GET",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );

//                 const data = await res.json();
//                 console.log("✅ API response:", data);

//                 if (data?.success) {
//                     setAdminPhoto(data?.adminPhoto || "");
//                     setCustomName(data?.customName || "");
//                     setHelpline(data?.helpline || "");
//                 } else {
//                     setAdminPhoto("");
//                     setCustomName("");
//                     setHelpline("");
//                 }
//             } catch (err) {
//                 console.log("❌ Admin detail API error:", err);
//             }
//         };

//         fetchAdminDetails();
//     }, [username]);

//     return (
//         <View style={styles.titleBarWrapper as StyleProp<ViewStyle>}>
//             <View style={styles.topHeaderRow as ViewStyle}>
//                 <View style={{ width: 40 }} />

//                 <Text style={styles.userText}>
//                     User : {props._localUserName}
//                 </Text>

//                 <Text style={styles.settingsIcon}>⚙️</Text>
//             </View>

//             <View style={styles.centerHeaderBlock as ViewStyle}>
//                 <View style={styles.logoBox as ViewStyle}>
//                     <Image
//                         source={{
//                             uri:
//                                 adminPhoto ||
//                                 "https://dummyimage.com/600x600/000/fff.png&text=ADMIN",
//                         }}
//                         style={styles.logoImage as any}
//                         resizeMode="cover"
//                     />
//                 </View>

//                 <Text style={styles.bigNameText}>
//                     {(customName || "").toUpperCase()}
//                 </Text>

//                 <Text style={styles.phoneText}>
//                     {helpline || ""}
//                 </Text>
//             </View>
//         </View>
//     );
// };

// function _mapStateToProps(state: IReduxState) {
//     const local = getLocalParticipant(state);

//     return {
//         _localUserName: local?.name || "",
//     };
// }

// export default connect(_mapStateToProps)(TitleBar);
import React, { useEffect, useState } from "react";
import { Image, StyleProp, Text, View, ViewStyle } from "react-native";
import { connect } from "react-redux";

import { IReduxState } from "../../../../app/types";
import { getLocalParticipant } from "../../../../base/participants/functions";

import styles from "./styles";

interface IProps {
    _localUserName: string;
}

const TitleBar = (props: IProps): JSX.Element => {
    // ✅ YAHI REAL USERNAME HAI (Admin_nikhil)
    const username =
        typeof props._localUserName === "string" && props._localUserName.trim() ? props._localUserName.trim() : "";

    const [adminPhoto, setAdminPhoto] = useState<string>("");
    const [customName, setCustomName] = useState<string>("");
    const [helpline, setHelpline] = useState<string>("");

    useEffect(() => {
        if (!username) return;

        const fetchAdminDetails = async () => {
            try {
                const API_BASE = "https://backend.konvoxa.com";

                console.log("✅ localUserName:", props._localUserName);
                console.log("✅ username used in API:", username);

                const res = await fetch(`${API_BASE}/api/users/adminDetail?username=${encodeURIComponent(username)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                console.log("✅ API response:", data);

                if (data?.success) {
                    setAdminPhoto(data?.adminPhoto || "");
                    setCustomName(data?.customName || "");
                    setHelpline(data?.helpline || "");
                } else {
                    setAdminPhoto("");
                    setCustomName("");
                    setHelpline("");
                }
            } catch (err) {
                console.log("❌ Admin detail API error:", err);
            }
        };

        fetchAdminDetails();
    }, [username]);

    return (
        <View style={styles.titleBarWrapper as StyleProp<ViewStyle>}>
            <View style={styles.topHeaderRow}>
                {/* LEFT SPACE */}
                <View style={styles.sideSlot} />

                {/* CENTER TEXT */}
                <View style={styles.centerSlot}>
                    <Text style={styles.userText}>User : {props._localUserName}</Text>
                </View>

                {/* RIGHT SPACE (settings ki jagah) */}
                <View style={styles.sideSlot}>
                    {/* settings future me enable karna ho to yaha dal dena */}
                    {/* <Text style={styles.settingsIcon}>⚙️</Text> */}
                </View>
            </View>

            <View style={styles.centerHeaderBlock as ViewStyle}>
                <View style={styles.logoBox as ViewStyle}>
                    <Image
                        source={{
                            uri: adminPhoto || "https://dummyimage.com/600x600/000/fff.png&text=ADMIN",
                        }}
                        style={styles.logoImage as any}
                        resizeMode="cover"
                    />
                </View>

                <Text style={styles.bigNameText}>{(customName || "").toUpperCase()}</Text>

                <Text style={styles.phoneText}>{helpline || ""}</Text>
            </View>
        </View>
    );
};

function _mapStateToProps(state: IReduxState) {
    const local = getLocalParticipant(state);

    return {
        _localUserName: local?.name || "",
    };
}

export default connect(_mapStateToProps)(TitleBar);
