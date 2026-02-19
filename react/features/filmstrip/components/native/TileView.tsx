import React, { PureComponent } from "react";
import { FlatList, GestureResponderEvent, SafeAreaView, TouchableWithoutFeedback, ViewToken } from "react-native";
import { EdgeInsets, withSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from "react-redux";

import { IReduxState, IStore } from "../../../app/types";
import { getLocalParticipant, getParticipantCountWithFake } from "../../../base/participants/functions";
import { ILocalParticipant } from "../../../base/participants/types";
import { getHideSelfView } from "../../../base/settings/functions.any";
import { setVisibleRemoteParticipants } from "../../actions.web";
import { getParticipantById } from "../../../base/participants/functions";
import Thumbnail from "./Thumbnail";
import styles from "./styles";

/**
 * The type of the React {@link Component} props of {@link TileView}.
 */
interface IProps {
    /**
     * Application's aspect ratio.
     */
    _aspectRatio: Symbol;

    /**
     * The number of columns.
     */
    _columns: number;

    /**
     * Whether or not to hide the self view.
     */
    _disableSelfView: boolean;

    /**
     * Application's viewport height.
     */
    _height: number;

    /**
     * The local participant.
     */
    _localParticipant?: ILocalParticipant;

    /**
     * The number of participants in the conference.
     */
    _participantCount: number;

    /**
     * An array with the IDs of the remote participants in the conference.
     */
    _remoteParticipants: Array<string>;

    /**
     * The thumbnail height.
     */
    _thumbnailHeight?: number;

    /**
     * Application's viewport height.
     */
    _width: number;

    /**
     * Invoked to update the receiver video quality.
     */
    dispatch: IStore["dispatch"];

    /**
     * Object containing the safe area insets.
     */
    insets: EdgeInsets;

    /**
     * Callback to invoke when tile view is tapped.
     */
    onClick: (e?: GestureResponderEvent) => void;
}

/**
 * An empty array. The purpose of the constant is to use the same reference every time we need an empty array.
 * This will prevent unnecessary re-renders.
 */
const EMPTY_ARRAY: any[] = [];

/**
 * Implements a React {@link PureComponent} which displays thumbnails in a two
 * dimensional grid.
 *
 * @augments PureComponent
 */
class TileView extends PureComponent<IProps> {
    /**
     * The styles for the content container of the FlatList.
     */
    _contentContainerStyles: any;

    /**
     * The styles for the FlatList.
     */
    _flatListStyles: any;

    /**
     * The FlatList's viewabilityConfig.
     */
    _viewabilityConfig: Object;

    /**
     * Creates new TileView component.
     *
     * @param {IProps} props - The props of the component.
     */
    constructor(props: IProps) {
        super(props);

        this._keyExtractor = this._keyExtractor.bind(this);
        this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
        this._renderThumbnail = this._renderThumbnail.bind(this);

        this._viewabilityConfig = {
            itemVisiblePercentThreshold: 30,
            minimumViewTime: 500,
        };
        this._flatListStyles = {
            ...styles.flatListTileView,
        };
        // this._contentContainerStyles = {
        //     ...styles.contentContainer,
        //     paddingBottom: this.props.insets?.bottom || 0,
        // };
        this._contentContainerStyles = {
            alignItems: "center",
            justifyContent: "flex-start", // Changed from center
            flexGrow: 1, // Allow content to grow
            paddingBottom: this.props.insets?.bottom || 0,
            paddingTop: 10, // Add some top padding
        };
    }

    /**
     * Returns a key for a passed item of the list.
     *
     * @param {string} item - The user ID.
     * @returns {string} - The user ID.
     */
    _keyExtractor(item: string) {
        return item;
    }

    /**
     * A handler for visible items changes.
     *
     * @param {Object} data - The visible items data.
     * @param {Array<Object>} data.viewableItems - The visible items array.
     * @returns {void}
     */
    _onViewableItemsChanged({ viewableItems = [] }: { viewableItems: ViewToken[] }) {
        const { _disableSelfView } = this.props;

        if (viewableItems[0]?.index === 0 && !_disableSelfView) {
            // Skip the local thumbnail.
            viewableItems.shift();
        }

        if (viewableItems.length === 0) {
            // User might be fast-scrolling, it will stabilize.
            return;
        }

        // We are off by one in the remote participants array.
        const startIndex = Number(viewableItems[0].index) - (_disableSelfView ? 0 : 1);
        const endIndex = Number(viewableItems[viewableItems.length - 1].index) - (_disableSelfView ? 0 : 1);

        this.props.dispatch(setVisibleRemoteParticipants(startIndex, endIndex));
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    // override render() {
    //     const { _columns, _height, _thumbnailHeight, _width, onClick } = this.props;
    //     const participants = this._getSortedParticipants();
    //     const initialRowsToRender = Math.ceil(_height / (Number(_thumbnailHeight) + 2 * styles.thumbnail.margin));

    //     if (this._flatListStyles.minHeight !== _height || this._flatListStyles.minWidth !== _width) {
    //         this._flatListStyles = {
    //             ...styles.flatListTileView,
    //             minHeight: _height,
    //             minWidth: _width,
    //         };
    //     }

    //     if (this._contentContainerStyles.minHeight !== _height || this._contentContainerStyles.minWidth !== _width) {
    //         this._contentContainerStyles = {
    //             ...styles.contentContainer,
    //             minHeight: _height,
    //             minWidth: _width,
    //             paddingBottom: this.props.insets?.bottom || 0,
    //         };
    //     }

    //     return (
    //         // <TouchableWithoutFeedback onPress={onClick}>
    //         //     <SafeAreaView style={styles.flatListContainer}>
    //         //         <FlatList
    //         //             bounces={false}
    //         //             contentContainerStyle={this._contentContainerStyles}
    //         //             data={participants}
    //         //             horizontal={false}
    //         //             initialNumToRender={initialRowsToRender}
    //         //             key={_columns}
    //         //             keyExtractor={this._keyExtractor}
    //         //             numColumns={_columns}
    //         //             onViewableItemsChanged={this._onViewableItemsChanged}
    //         //             renderItem={this._renderThumbnail}
    //         //             showsHorizontalScrollIndicator={false}
    //         //             showsVerticalScrollIndicator={false}
    //         //             style={this._flatListStyles}
    //         //             viewabilityConfig={this._viewabilityConfig}
    //         //             windowSize={2}
    //         //         />
    //         //     </SafeAreaView>
    //         // </TouchableWithoutFeedback>
    //         <TouchableWithoutFeedback onPress={onClick}>
    //             <SafeAreaView style={styles.flatListContainer}>
    //                 <FlatList
    //                     bounces={true} // Changed from false - allow bouncing
    //                     contentContainerStyle={this._contentContainerStyles}
    //                     data={participants}
    //                     horizontal={false}
    //                     initialNumToRender={6} // Fixed number
    //                     key={_columns}
    //                     keyExtractor={this._keyExtractor}
    //                     numColumns={_columns}
    //                     onViewableItemsChanged={this._onViewableItemsChanged}
    //                     renderItem={this._renderThumbnail}
    //                     showsHorizontalScrollIndicator={false}
    //                     showsVerticalScrollIndicator={true} // Show scroll indicator
    //                     style={this._flatListStyles}
    //                     viewabilityConfig={this._viewabilityConfig}
    //                     windowSize={2}
    //                 />
    //             </SafeAreaView>
    //         </TouchableWithoutFeedback>
    //     );
    // }
    override render() {
        const { _columns, _height, _thumbnailHeight, _width, onClick } = this.props;
        const participants = this._getSortedParticipants();

        // Styles for FlatList
        const flatListStyles = {
            flex: 1,
            width: _width,
            backgroundColor: "#fcdfdf", // Dark background like screenshot
        };

        const contentContainerStyles = {
            paddingTop: 60,
            paddingBottom: this.props.insets?.bottom || 0,
            paddingHorizontal: 2, // Minimal side padding
        };

        return (
            <TouchableWithoutFeedback onPress={onClick}>
                <SafeAreaView style={{ flex: 1, backgroundColor: "#090909" }}>
                    <FlatList
                        bounces={true}
                        contentContainerStyle={contentContainerStyles}
                        data={participants}
                        horizontal={false}
                        initialNumToRender={9} // Show 3 rows initially
                        key={_columns}
                        keyExtractor={this._keyExtractor}
                        numColumns={_columns}
                        onViewableItemsChanged={this._onViewableItemsChanged}
                        renderItem={this._renderThumbnail}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={flatListStyles}
                        viewabilityConfig={this._viewabilityConfig}
                        windowSize={3}
                    />
                </SafeAreaView>
            </TouchableWithoutFeedback>
        );
    }
    /**
     * Returns all participants with the local participant at the end.
     *
     * @private
     * @returns {Participant[]}
     */
    // _getSortedParticipants() {
    //     const { _localParticipant, _remoteParticipants, _disableSelfView } = this.props;

    //     if (!_localParticipant) {
    //         return EMPTY_ARRAY;
    //     }

    //     if (_disableSelfView) {
    //         return _remoteParticipants;
    //     }

    //     return [_localParticipant?.id, ..._remoteParticipants];
    // }

    _getSortedParticipants() {
        const { _remoteParticipants } = this.props;

        // Always hide local participant from tile view
        return _remoteParticipants;
    }
    /**
     * Creates React Element to display each participant in a thumbnail.
     *
     * @private
     * @returns {ReactElement}
     */
    // _renderThumbnail({ item }: { item: string }) {
    //     // const { _thumbnailHeight } = this.props;
    //     const FIXED_HEIGHT = 180; // Set your desired fixed height

    //     return (
    //         <Thumbnail height={FIXED_HEIGHT} key={item} participantID={item} renderDisplayName={true} tileView={true} />
    //     );
    // }
    _renderThumbnail({ item }: { item: string }) {
        const { _thumbnailHeight, _thumbnailWidth } = this.props;

        return (
            <Thumbnail
                height={_thumbnailHeight}
                width={_thumbnailWidth}
                key={item}
                participantID={item}
                renderDisplayName={true}
                tileView={true}
            />
        );
    }

    override componentDidMount() {
        // Small delay ensures layout is fully mounted
        setTimeout(() => {
            this.props.onClick?.();
        }, 100);
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code TileView}'s props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - Component props.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState, ownProps: any) {
    const responsiveUi = state["features/base/responsive-ui"];
    const { remoteParticipants } = state["features/filmstrip"];
    const disableSelfView = true;
    const localParticipant = getLocalParticipant(state);
    // 🔍 DEBUG: Print all participants to see their properties
    console.log("🔍 LOCAL PARTICIPANT:", localParticipant);

    remoteParticipants.forEach((participantId) => {
        const participant = getParticipantById(state, participantId);
        console.log("🔍 REMOTE PARTICIPANT:", {
            id: participantId,
            name: participant?.name,
            role: participant?.role,
            local: participant?.local,
            isAdmin: participant?.isAdmin,
            isModerator: participant?.isModerator,
            allProperties: participant,
        });
    });

    // 🔥 Filter out moderators/hosts
    const filteredRemoteParticipants = remoteParticipants.filter((participantId) => {
        const participant = getParticipantById(state, participantId);

        console.log(
            "NIKHIL_LOGS",
            `participant name:- ${participant?.name} --- participant role:-${participant?.role} --- isLocal:-${participant?.local} ------ name:-${participant?.displayName}`,
        );
        // Exclude if participant is a moderator
        const local = participant?.local;

        return !local;
    });

    const screenWidth = responsiveUi.clientWidth - (ownProps.insets?.left || 0) - (ownProps.insets?.right || 0);

    // 3 columns with small margins
    const COLUMNS = 3;
    const MARGIN = 4; // Small margin between tiles
    const tileWidth = (screenWidth - MARGIN * (COLUMNS + 1)) / COLUMNS;

    return {
        _aspectRatio: responsiveUi.aspectRatio,
        _columns: COLUMNS, // 🔥 3 columns
        _disableSelfView: disableSelfView,
        _height: responsiveUi.clientHeight - (ownProps.insets?.top || 0),
        _insets: ownProps.insets,
        _localParticipant: getLocalParticipant(state),
        _participantCount: getParticipantCountWithFake(state),
        _remoteParticipants: filteredRemoteParticipants,
        _thumbnailHeight: tileWidth, // Square tiles
        _thumbnailWidth: tileWidth,
        _width: screenWidth,
    };
}
export default withSafeAreaInsets(connect(_mapStateToProps)(TileView));
