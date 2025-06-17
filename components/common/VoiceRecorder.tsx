import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Audio,
    AVPlaybackStatus,
    AVPlaybackStatusSuccess,
} from "expo-av";
import WaveformVisualizer from "./WaveformVisualizer";

type VoiceRecorderProps = {
    onRecordingComplete: (uris: string[]) => void;
};

export default function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordings, setRecordings] = useState<string[]>([]);
    const [durations, setDurations] = useState<number[]>([]);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean[]>([]);
    const [recordingDuration, setRecordingDuration] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<number | null>(null);


    useEffect(() => {
        return () => {
            if (sound) sound.unloadAsync();
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [sound]);

    const startRecording = async () => {
        if (recordings.length >= 5) {
            Alert.alert("Limit reached", "You can only record up to 5 voice notes.");
            return;
        }

        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") return;

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setRecordingDuration(0);

        const interval = setInterval(() => {
            setRecordingDuration((prev) => prev + 1);
        }, 1000);
        setTimerInterval(interval);
    };

    const stopRecording = async () => {
        if (!recording) return;

        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }

        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
            const updated = [...recordings, uri];
            const updatedDurations = [...durations, recordingDuration];
            setRecordings(updated);
            setDurations(updatedDurations);
            setIsPlaying((prev) => [...prev, false]);
            onRecordingComplete(updated);
        }

        setRecording(null);
        setRecordingDuration(0);
    };

    const togglePlayback = async (index: number) => {
        const uri = recordings[index];
        if (!uri) return;

        if (sound && isPlaying[index]) {
            await sound.pauseAsync();
            const newStates = [...isPlaying];
            newStates[index] = false;
            setIsPlaying(newStates);
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync({ uri });
            setSound(newSound);

            const newStates = [...isPlaying];
            newStates[index] = true;
            setIsPlaying(newStates);

            newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
                if (!status.isLoaded) return;

                const successStatus = status as AVPlaybackStatusSuccess;
                if (successStatus.didJustFinish) {
                    const updatedStates = [...isPlaying];
                    updatedStates[index] = false;
                    setIsPlaying(updatedStates);
                }
            });

            await newSound.playAsync();
        }
    };

    const deleteRecording = (index: number) => {
        const updatedRecordings = recordings.filter((_, i) => i !== index);
        const updatedDurations = durations.filter((_, i) => i !== index);
        const updatedPlaying = isPlaying.filter((_, i) => i !== index);

        setRecordings(updatedRecordings);
        setDurations(updatedDurations);
        setIsPlaying(updatedPlaying);
        onRecordingComplete(updatedRecordings);
    };

    return (
        <View className="items-center mb-6 w-full">
            <TouchableOpacity
                className="w-14 h-14 bg-white rounded-full shadow-md items-center justify-center"
                onPress={recording ? stopRecording : startRecording}
            >
                <Ionicons name={recording ? "stop-circle" : "mic"} size={26} color="black" />
            </TouchableOpacity>

            {recording && (
                <View className="items-center mt-3">
                    <WaveformVisualizer />
                    <Text className="text-gray-600 text-sm mt-1">
                        Recording: {recordingDuration}s
                    </Text>
                </View>
            )}

            {recordings.length > 0 && (
                <View className="w-full mt-4 space-y-2">
                    {recordings.map((uri, index) => (
                        <View
                            key={index}
                            className="flex-row items-center justify-between px-4 py-2 bg-gray-200 rounded-full"
                        >
                            <TouchableOpacity
                                className="flex-row items-center"
                                onPress={() => togglePlayback(index)}
                            >
                                <Ionicons
                                    name={isPlaying[index] ? "pause" : "play"}
                                    size={20}
                                    color="black"
                                />
                                <Text className="ml-2">Voice Note {index + 1}</Text>
                                <Text className="ml-2 text-xs text-gray-600">
                                    ({durations[index]}s)
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => deleteRecording(index)}>
                                <Ionicons name="close" size={18} color="black" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
