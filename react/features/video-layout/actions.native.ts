import { IStore } from "../../app/types";
import { getLocalParticipant } from "../base/participants/functions";

import { SET_CAR_MODE } from "./actionTypes";

export * from "./actions.any";

/**
 * Creates a (redux) action which tells whether we are in carmode.
 * Prevents non-moderators from disabling car mode.
 *
 * @param {boolean} enabled - Whether we are in carmode.
 * @returns {Function}
 */
export function setIsCarmode(enabled: boolean) {
    return (dispatch: IStore["dispatch"], getState: IStore["getState"]) => {
        const state = getState();
        const localParticipant = getLocalParticipant(state);
        const isModerator = localParticipant?.role === "moderator";
        const { carModeLocked } = state["features/video-layout"];

        // Block non-moderators from disabling car mode
        if (carModeLocked && !isModerator && !enabled) {
            console.log("Car mode is locked for non-moderators. Cannot disable.");
            return;
        }

        dispatch({
            type: SET_CAR_MODE,
            enabled,
        });
    };
}
