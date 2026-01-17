import { NativeEventEmitter, NativeModules } from "react-native";
import { AnyAction } from "redux";
import { IStore } from "../../app/types";
import { APP_WILL_MOUNT, APP_WILL_UNMOUNT } from "../../base/app/actionTypes";
import { SET_AUDIO_ONLY } from "../../base/audio-only/actionTypes";
import { CONFERENCE_FAILED, CONFERENCE_JOINED, CONFERENCE_LEFT } from "../../base/conference/actionTypes";
import { getCurrentConference } from "../../base/conference/functions";
import { SET_CONFIG } from "../../base/config/actionTypes";
import { AUDIO_FOCUS_DISABLED } from "../../base/flags/constants";
import { getFeatureFlag } from "../../base/flags/functions";
import MiddlewareRegistry from "../../base/redux/MiddlewareRegistry";
import { parseURIString } from "../../base/util/uri";
import { _SET_AUDIOMODE_DEVICES, _SET_AUDIOMODE_SUBSCRIPTIONS } from "./actionTypes";
import { getLocalParticipant } from "../../base/participants/functions"; // ✅ Needed for local participant
import logger from "./logger";
import { PARTICIPANT_ROLE } from "../../base/participants/constants";

const { AudioMode } = NativeModules;
const AudioModeEmitter = new NativeEventEmitter(AudioMode);

MiddlewareRegistry.register((store) => (next) => (action) => {
    console.log("[Middleware] Action received:", action.type, action);

    switch (action.type) {
        case _SET_AUDIOMODE_SUBSCRIPTIONS:
            console.log("[Middleware] _SET_AUDIOMODE_SUBSCRIPTIONS triggered");
            _setSubscriptions(store);
            break;

        case APP_WILL_UNMOUNT:
            console.log("[Middleware] APP_WILL_UNMOUNT triggered, clearing subscriptions");
            store.dispatch({ type: _SET_AUDIOMODE_SUBSCRIPTIONS, subscriptions: [] });
            break;

        case APP_WILL_MOUNT:
            _appWillMount(store);

            AudioMode.getCurrentRoute?.().then((route: string) => {
                const local = getLocalParticipant(store.getState());
                if (!local) return;

                store.dispatch({
                    type: "LOCAL_AUDIO_ROUTE_CHANGED",
                    participantId: local.id,
                    route,
                });
            });
            break;

        case CONFERENCE_FAILED:
        case CONFERENCE_LEFT:
        case CONFERENCE_JOINED:
        case SET_AUDIO_ONLY:
            console.log("[Middleware] Audio mode update triggered due to conference/action change:", action.type);
            return _updateAudioMode(store, next, action);

        case SET_CONFIG: {
            const { locationURL } = store.getState()["features/base/connection"];
            const location = parseURIString(locationURL?.href ?? "");
            console.log("[Middleware] SET_CONFIG triggered, location:", location.href ?? location);
            if (location.room) {
                const { startSilent } = action.config;
                console.log("[Middleware] SET_CONFIG startSilent:", startSilent);
                AudioMode.setDisabled?.(Boolean(startSilent));
            }
            break;
        }

        case "FORCE_REMOTE_SPEAKER": {
            const { participantId } = action;

            const state = store.getState();
            const localParticipant = getLocalParticipant(state);

            if (localParticipant?.role !== PARTICIPANT_ROLE.MODERATOR) {
                console.warn("❌ Non-moderator tried FORCE_REMOTE_SPEAKER");
                break;
            }

            const conference = getCurrentConference(state);
            if (!conference) {
                console.warn("❌ No conference found");
                break;
            }

            console.log("🔥 Moderator forcing SPEAKER for", participantId);

            conference.sendEndpointMessage(participantId, {
                type: "FORCE_AUDIO_ROUTE",
                route: "SPEAKER",
            });

            break;
        }


        case "ENDPOINT_MESSAGE_RECEIVED": {
            const { participant, senderId, data } = action;
            console.log("📩 Endpoint action:", action);
            const localParticipant = getLocalParticipant(store.getState());
            if (!localParticipant) {
                break;
            }

            // 🔥 FORCE AUDIO ROUTE (Moderator → This User)
            if (data?.type === "FORCE_AUDIO_ROUTE" && data?.route === "SPEAKER") {
                console.log("🔥 FORCE_AUDIO_ROUTE received → switching to SPEAKER");

                AudioMode.setForceSpeaker?.(true);
                AudioMode.setAudioDevice?.(AudioMode.SPEAKER ?? "SPEAKER");

                store.dispatch({
                    type: "LOCAL_AUDIO_ROUTE_CHANGED",
                    participantId: localParticipant.id,
                    route: "SPEAKER"
                });

                break;
            }


            const participantId = participant?.id || senderId;
            if (!participantId) {
                console.warn("❌ AUDIO_ROUTE_CHANGED without participantId");
                break;
            }

            if (data?.name === "AUDIO_ROUTE_CHANGED" || data?.name === "USER_AUDIO_DEVICE") {
                store.dispatch({
                    type: "REMOTE_AUDIO_ROUTE_CHANGED",
                    participantId,
                    route: data.route ?? data.deviceType,
                });
            }
            break;
        }
    }

    const result = next(action);
    console.log(
        "[Middleware] Action processed:",
        action.type,
        "Current audio-mode state:",
        store.getState()["features/mobile/audio-mode"]
    );
    return result;
});

function _appWillMount(store: IStore) {
    const subscriptions = [
        AudioModeEmitter.addListener(AudioMode.DEVICE_CHANGE_EVENT, (devices: any) => {
            store.dispatch({ type: _SET_AUDIOMODE_DEVICES, devices });
        }),
    ];

    store.dispatch({ type: _SET_AUDIOMODE_SUBSCRIPTIONS, subscriptions });
}

function _setSubscriptions(store: IStore) {
    const { subscriptions } = store.getState()["features/mobile/audio-mode"];
    if (subscriptions?.length) {
        for (const sub of subscriptions) sub.remove();
    }
}

function _updateAudioMode(store: IStore, next: Function, action: AnyAction) {
    const result = next(action);
    const state = store.getState();
    const conference = getCurrentConference(state);
    const audioOnly = state["features/base/audio-only"].enabled;

    if (getFeatureFlag(state, AUDIO_FOCUS_DISABLED, false)) {
        return result;
    }

    let mode: string = AudioMode.DEFAULT;
    if (conference) {
        mode = audioOnly ? AudioMode.AUDIO_CALL : AudioMode.VIDEO_CALL;
    }

    AudioMode.setMode(mode).catch((err) => logger.error(`Failed to set audio mode ${mode}: ${err}`));

    return result;
}
