import { NativeModules } from "react-native";

const { AudioMode } = NativeModules;

export function forceSpeaker() {
    AudioMode.setAudioDevice("SPEAKER");
}
