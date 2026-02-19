import BaseTheme from "../../../../base/ui/components/BaseTheme.native";

/**
 * 🔥 Microphone size reduced for mobile fit
 */
const MICROPHONE_SIZE = 210;

export default {
    // 🔥 MAIN SCREEN
    conference: {
        flex: 1,
        backgroundColor: "#ffd6e6",
    },

    // 🔥 HEADER HEIGHT REDUCED
    titleBarSafeViewColor: {
        width: "100%",
        backgroundColor: "#007BFF",
        paddingTop: BaseTheme.spacing[2], // 🔥 reduced
        paddingBottom: BaseTheme.spacing[2], // 🔥 reduced
    },

    titleBar: {
        alignSelf: "center",
        width: "100%",
    },

    roomTimer: {
        color: "white",
        textAlign: "center",
        marginTop: 4, // 🔥 reduced
        fontSize: 13,
        fontWeight: "800",
    },

    // ✅ BODY
    body: {
        flex: 1,
        alignItems: "center",
        paddingTop: 18,
    },

    connectedWrapper: {
        alignItems: "center",
        marginTop: 16,
        marginBottom: 10,
    },

    connectedText: {
        fontSize: 34,
        fontWeight: "900",
        color: "#111",
        textAlign: "center",
    },

    // ✅ Buttons container inside body (MIC KE UPAR)
    footerInsideBody: {
        width: "100%",
        paddingHorizontal: 14,
        marginTop: 6,
        marginBottom: 18,
    },

    // 🔥 MIC CENTER AREA
    microphoneContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },

    microphoneStyles: {
        container: {
            borderRadius: MICROPHONE_SIZE / 2,
            height: MICROPHONE_SIZE,
            width: MICROPHONE_SIZE,
            justifyContent: "center",
            overflow: "hidden",
            borderWidth: 10,
            borderColor: "#222",
            backgroundColor: "#8e8e8e",
        },

        iconContainer: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#9c9c9c",
        },
        iconContainer2: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: "#00c853",
        },

        icon: {
            color: "white",
            fontSize: MICROPHONE_SIZE * 0.42,
        },

        unmuted: {
            borderColor: "#00c853",
            backgroundColor: "#00c853",
        },
    },

    // 🔥 FOOTER BUTTONS ROW (CarModeFooter ke cards)
    bottomContainer: {
        width: "100%",
        paddingHorizontal: 14,
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: "transparent",
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
    },

    actionCard: {
        flex: 1,
        backgroundColor: "#f3f3f3",
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        height: 92, // 🔥 reduced
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },

    actionIcon: {
        fontSize: 40, // 🔥 reduced
        marginBottom: 6,
    },

    actionText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#111",
    },

    hiddenActionButton: {
        position: "absolute",
        opacity: 0,
        width: "100%",
        height: "100%",
    },

    // ✅ TitleBar extra styles (agar TitleBar use kar raha ho)
    titleBarWrapper: {
        width: "100%",
        paddingHorizontal: 16,
        paddingTop: 4,
    },

    topHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    userText: {
        color: "#1a1a1a",
        fontSize: 24, // 🔥 reduced
        fontWeight: "900",
    },

    settingsIcon: {
        fontSize: 32,
        color: "#111",
    },

    centerHeaderBlock: {
        alignItems: "center",
        marginTop: 8, // 🔥 reduced
    },

    logoBox: {
        width: 120, // 🔥 reduced
        height: 120, // 🔥 reduced
        backgroundColor: "#000",
        borderRadius: 2,
        overflow: "hidden",
    },

    logoImage: {
        width: "100%",
        height: "100%",
    },

    bigNameText: {
        marginTop: 8,
        fontSize: 38, // 🔥 reduced
        fontWeight: "900",
        color: "white",
        letterSpacing: 1,
    },

    phoneText: {
        marginTop: 5,
        fontSize: 16, // 🔥 reduced
        fontWeight: "800",
        color: "white",
        opacity: 0.95,
        textAlign: "center",
    },

    adminMessageBar: {
        marginTop: 35,
        backgroundColor: "#111",
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: "center",
    },

    adminMessageText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        textAlign: "center",
    },
};
