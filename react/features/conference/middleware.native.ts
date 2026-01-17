// nikhil chnaged code
import { appNavigate } from "../app/actions.native";
import { CONFERENCE_JOINED, KICKED_OUT } from "../base/conference/actionTypes";
import { conferenceLeft } from "../base/conference/actions.native";
import { getLocalParticipant } from "../base/participants/functions";
import MiddlewareRegistry from "../base/redux/MiddlewareRegistry";
import StateListenerRegistry from "../base/redux/StateListenerRegistry";

import { navigate } from "../mobile/navigation/components/conference/ConferenceNavigationContainerRef";
import { screen } from "../mobile/navigation/routes";

import { SET_CAR_MODE_LOCKED } from "../video-layout/actionTypes";
import { setIsCarmode } from "../video-layout/actions.native";

import { notifyKickedOut } from "./actions.native";
import "./middleware.any";

console.log("🚗 [MIDDLEWARE] Conference middleware loaded");

MiddlewareRegistry.register((store) => (next) => (action) => {
    if (action.type === CONFERENCE_JOINED) {
        console.log("🚗 [MIDDLEWARE] ✅ CONFERENCE_JOINED detected");
    }

    if (action.type === KICKED_OUT) {
        console.log("🚗 [MIDDLEWARE] KICKED_OUT detected");
    }

    switch (action.type) {
        case KICKED_OUT: {
            const { dispatch } = store;

            dispatch(
                notifyKickedOut(action.participant, () => {
                    dispatch(conferenceLeft(action.conference));
                    dispatch(appNavigate(undefined));
                })
            );

            break;
        }

        case CONFERENCE_JOINED: {
            console.log("🚗 [MIDDLEWARE] Calling _enforceViewModeOnJoin");
            // Enforce car mode for ALL users when joining conference
            _enforceViewModeOnJoin(store);
            break;
        }
    }

    return next(action);
});

/**
 * Listen for participant role changes
 */
StateListenerRegistry.register(
    /* selector */ (state) => {
        const localParticipant = getLocalParticipant(state);
        return localParticipant?.role;
    },
    /* listener */ (role, { dispatch, getState }) => {
        console.log("🚗 [STATE LISTENER] Role changed to:", role);
        if (role) {
            _enforceViewModeBasedOnRole({ dispatch, getState });
        }
    }
);

/**
 * Enforces car mode for ALL users when joining the conference.
 * TESTING VERSION - No moderator check
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _enforceViewModeOnJoin({ dispatch, getState }: any) {
    console.log("🚗 [ENFORCE] _enforceViewModeOnJoin called");

    const state = getState();
    const localParticipant = getLocalParticipant(state);

    console.log("🚗 [ENFORCE] Local participant:", {
        id: localParticipant?.id,
        name: localParticipant?.name,
        role: localParticipant?.role,
    });

    if (!localParticipant) {
        console.log("🚗 [ENFORCE] ⚠️ No local participant found, skipping");
        return;
    }

    const isModerator = localParticipant.role === "moderator";

    console.log("🚗 [ENFORCE] User is moderator:", isModerator);

    if (isModerator) {
        // Moderator: Allow normal view
        dispatch(setIsCarmode(false));
        dispatch({ type: SET_CAR_MODE_LOCKED, locked: false });
        console.log("🚗 { type: SET_CAR_MODE_LOCKED, locked: false }");
    } else {
        // Regular user: Force and lock car mode
        dispatch(setIsCarmode(true));
        dispatch({ type: SET_CAR_MODE_LOCKED, locked: true });
        console.log("🚗 { type: SET_CAR_MODE_LOCKED, locked: true }");
    }
}

/**
 * Enforces the appropriate view mode based on participant role changes.
 * TESTING VERSION - Still forces car mode for all
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _enforceViewModeBasedOnRole({ dispatch, getState }: any) {
    console.log("🚗 [ROLE CHECK] _enforceViewModeBasedOnRole called");

    const state = getState();
    const localParticipant = getLocalParticipant(state);

    if (!localParticipant) {
        console.log("🚗 [ROLE CHECK] ⚠️ No local participant");
        return;
    }

    const isModerator = localParticipant.role === "moderator";
    const { carMode } = state["features/video-layout"];

    console.log("🚗 [ROLE CHECK] Participant details:", {
        id: localParticipant.id,
        name: localParticipant.name,
        role: localParticipant.role,
        isModerator,
    });

    if (isModerator) {
        // Moderator: Release car mode lock and allow normal view
        dispatch({
            type: SET_CAR_MODE_LOCKED,
            locked: false,
        });
        // Optionally disable car mode for moderators
        dispatch(setIsCarmode(false));
        // ✅ FIX: If currently in car mode screen, navigate back to main conference
        if (carMode) {
            console.log("🚗 [MIDDLEWARE] Moderator detected while in car mode, navigating to main conference");
            setTimeout(() => {
                navigate(screen.conference.main);
            }, 100);
        }
    } else {
        // Regular user: Lock in car mode
        dispatch(setIsCarmode(true));
        dispatch({
            type: SET_CAR_MODE_LOCKED,
            locked: true,
        });
    }
}
