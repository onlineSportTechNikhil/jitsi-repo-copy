import ReducerRegistry from "../base/redux/ReducerRegistry";

import {
    SET_CAR_MODE,
    SET_CAR_MODE_LOCKED,
    SET_TILE_VIEW,
    VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED,
} from "./actionTypes";

const DEFAULT_STATE = {
    /**
     * Whether we are in carmode.
     *
     * @public
     * @type {boolean}
     */
    carMode: false,

    /**
     * Whether car mode is locked (user cannot exit car mode).
     *
     * @public
     * @type {boolean}
     */
    carModeLocked: false,

    remoteScreenShares: [],

    /**
     * The indicator which determines whether the video layout should display
     * video thumbnails in a tiled layout.
     *
     * Note: undefined means that the user hasn't requested anything in particular yet, so
     * we use our auto switching rules.
     *
     * @public
     * @type {boolean}
     */
    tileViewEnabled: undefined,
};

const getInitialState = (state) => {
    const isCarMode = getFeatureFlag(state, IS_CAR_MODE, false);

    console.log("🚀 Initial Layout Flag isCarMode:", isCarMode);

    return {
        carMode: isCarMode,
        carModeLocked: true, // IMPORTANT: prevents later flip
        remoteScreenShares: [],
        tileViewEnabled: isCarMode ? false : true,
    };
};

export interface IVideoLayoutState {
    carMode: boolean;
    carModeLocked: boolean;
    remoteScreenShares: string[];
    tileViewEnabled?: boolean;
}

const STORE_NAME = "features/video-layout";

ReducerRegistry.register<IVideoLayoutState>(STORE_NAME, (state = DEFAULT_STATE, action): IVideoLayoutState => {
    switch (action.type) {
        case VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED:
            return {
                ...state,
                remoteScreenShares: action.participantIds,
            };

        case SET_CAR_MODE:
            console.log("🚗 [REDUCER] SET_CAR_MODE received, enabled:", action.enabled);
            console.log("🚗 [REDUCER] Previous carMode:", state.carMode);
            console.log("🚗 [REDUCER] New carMode:", action.enabled);
            return {
                ...state,
                carMode: action.enabled,
            };

        case SET_CAR_MODE_LOCKED:
            console.log("🚗 [REDUCER] SET_CAR_MODE_LOCKED received, locked:", action.locked);
            console.log("🚗 [REDUCER] Previous carModeLocked:", state.carModeLocked);
            console.log("🚗 [REDUCER] New carModeLocked:", action.locked);
            return {
                ...state,
                carModeLocked: action.locked,
            };

        case SET_TILE_VIEW:
            console.log("🚗 [REDUCER] SET_TILE_VIEW received, enabled:", action.enabled);
            return {
                ...state,
                tileViewEnabled: action.enabled,
            };
    }

    return state;
});
