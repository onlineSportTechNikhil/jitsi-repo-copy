import { Middleware, applyMiddleware } from "redux";
import { IReduxState, IStore } from "../../app/types";
import { ENDPOINT_MESSAGE_RECEIVED } from "../conference/actionTypes.ts";
// import { IMobileAudioModeState } from "../mobile/audio-mode/reducer.ts";
import { SET_PARTICIPANT_AUDIO_DEVICE } from "../../mobile/audio-mode/reducer.ts";

/**
 * A registry for Redux middleware, allowing features to register their
 * middleware without needing to create additional inter-feature dependencies.
 */
class MiddlewareRegistry {
    _elements: Array<Middleware<any, any>>;

    constructor() {
        this._elements = [];
    }

    applyMiddleware(...additional: Array<Middleware<any, any>>) {
        return applyMiddleware(...this._elements, ...additional);
    }

    register(middleware: Middleware<any, IReduxState, IStore["dispatch"]>) {
        this._elements.push(middleware);
    }
}

/**
 * Public singleton instance of the MiddlewareRegistry.
 */
const registry = new MiddlewareRegistry();
export default registry;

/**
 * Moderator-side middleware for tracking participants' audio devices
 */
registry.register((store) => (next) => (action) => {
    const result = next(action);

    if (action.type === ENDPOINT_MESSAGE_RECEIVED) {
        const { participant, data } = action;
        const { dispatch } = store;

        if (data?.name === "USER_AUDIO_DEVICE") {
            // Participant audio device update
            dispatch({
                type: SET_PARTICIPANT_AUDIO_DEVICE,
                participantId: participant.id,
                deviceType: data.deviceType, // 'EARPIECE', 'HEADPHONES', 'SPEAKER', etc.
            });
        }
    }

    return result;
});
