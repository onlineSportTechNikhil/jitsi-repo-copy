import ReducerRegistry from "../../base/redux/ReducerRegistry";
import { equals, set } from "../../base/redux/functions";
import { _SET_AUDIOMODE_DEVICES, _SET_AUDIOMODE_SUBSCRIPTIONS } from "./actionTypes";
import { getLocalParticipant } from "../../base/participants/functions";

/**
 * Action type for updating a participant's audio device.
 */
export const SET_PARTICIPANT_AUDIO_DEVICE = "SET_PARTICIPANT_AUDIO_DEVICE";

export interface IMobileAudioModeState {
    devices: string[];
    subscriptions: { remove: Function }[];
    participantsDevices: {
        [participantId: string]: string; // 'EARPIECE', 'HEADPHONES', 'SPEAKER', etc.
    };
}

const DEFAULT_STATE: IMobileAudioModeState = {
    devices: [],
    subscriptions: [],
    participantsDevices: {},
};
function normalizeRoute(route?: string) {
    if (!route) return "SPEAKER";

    const r = route.toUpperCase();

    if (r.includes("SPEAKER")) return "SPEAKER";
    if (r.includes("RECEIVER") || r.includes("EARPIECE")) return "EARPIECE";
    if (r.includes("HEADPHONE") || r.includes("WIRED")) return "HEADPHONES";
    if (r.includes("BLUETOOTH")) return "BLUETOOTH";

    return "SPEAKER";
}

ReducerRegistry.register<IMobileAudioModeState>(
    "features/mobile/audio-mode",
    (state = DEFAULT_STATE, action): IMobileAudioModeState => {
        console.log("[audio-mode reducer] action received:", action);

        switch (action.type) {
            case _SET_AUDIOMODE_DEVICES: {
                const { devices } = action;
                console.log("[audio-mode reducer] _SET_AUDIOMODE_DEVICES:", devices);
                if (equals(state.devices, devices)) {
                    console.log("[audio-mode reducer] Devices unchanged, returning current state");
                    return state;
                }
                const newState = set(state, "devices", devices);
                console.log("[audio-mode reducer] Updated devices state:", newState);
                return newState;
            }

            case _SET_AUDIOMODE_SUBSCRIPTIONS: {
                const { subscriptions } = action;
                console.log("[audio-mode reducer] _SET_AUDIOMODE_SUBSCRIPTIONS:", subscriptions);
                const newState = set(state, "subscriptions", subscriptions);
                console.log("[audio-mode reducer] Updated subscriptions state:", newState);
                return newState;
            }

            case SET_PARTICIPANT_AUDIO_DEVICE: {
                const { participantId, deviceType } = action;
                console.log(
                    `[audio-mode reducer] SET_PARTICIPANT_AUDIO_DEVICE for participantId=${participantId} deviceType=${deviceType}`
                );

                const currentDevice = state.participantsDevices[participantId] ?? "DEFAULT"; // ✅ fallback
                if (currentDevice === deviceType) {
                    console.log("[audio-mode reducer] Device unchanged, returning current state");
                    return state;
                }

                const newState = {
                    ...state,
                    participantsDevices: {
                        ...state.participantsDevices,
                        [participantId]: deviceType ?? "DEFAULT", // ✅ ensure non-undefined
                    },
                };
                console.log("[audio-mode reducer] Updated participantsDevices state:", newState.participantsDevices);
                return newState;
            }

            case "REMOTE_AUDIO_ROUTE_CHANGED": {
                const { participantId, route } = action;

                return {
                    ...state,
                    participantsDevices: {
                        ...state.participantsDevices,
                        [participantId]: normalizeRoute(route),
                    },
                };
            }

            case "LOCAL_AUDIO_ROUTE_CHANGED": {
                const { participantId, route } = action;

                if (!participantId) {
                    console.warn("❌ LOCAL_AUDIO_ROUTE_CHANGED without participantId", action);
                    return state;
                }

                const normalized = normalizeRoute(route);

                return {
                    ...state,
                    participantsDevices: {
                        ...state.participantsDevices,
                        [participantId]: normalized,
                    },
                };
            }

            default:
                return state;
        }
    }
);
