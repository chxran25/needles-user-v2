import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import WaveformVisualizer from "./WaveformVisualizer";
import { LinearGradient } from "expo-linear-gradient";

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
    const [playbackProgress, setPlaybackProgress] = useState<number[]>([]); // ✅ new

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

        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
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
            setRecordings(updated);
            setDurations([...durations, recordingDuration]);
            setIsPlaying([...isPlaying, false]);
            setPlaybackProgress([...playbackProgress, 0]); // ✅ track new recording
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
                const s = status as AVPlaybackStatusSuccess;

                if (s.didJustFinish) {
                    const updatedStates = [...isPlaying];
                    updatedStates[index] = false;
                    setIsPlaying(updatedStates);

                    setPlaybackProgress((prev) => {
                        const copy = [...prev];
                        copy[index] = 1;
                        return copy;
                    });
                } else {
                    const progress = s.durationMillis ? s.positionMillis / s.durationMillis : 0;
                    setPlaybackProgress((prev) => {
                        const copy = [...prev];
                        copy[index] = progress;
                        return copy;
                    });
                }
            });

            await newSound.playAsync();
        }
    };

    const deleteRecording = (index: number) => {
        const updatedRecordings = recordings.filter((_, i) => i !== index);
        const updatedDurations = durations.filter((_, i) => i !== index);
        const updatedPlaying = isPlaying.filter((_, i) => i !== index);
        const updatedProgress = playbackProgress.filter((_, i) => i !== index);

        setRecordings(updatedRecordings);
        setDurations(updatedDurations);
        setIsPlaying(updatedPlaying);
        setPlaybackProgress(updatedProgress);
        onRecordingComplete(updatedRecordings);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View className="items-center w-full">
            {/* Record Button */}
            <View className="items-center mb-6">
                <TouchableOpacity
                    className={`w-20 h-20 rounded-full items-center justify-center shadow-lg ${
                        recording ? 'bg-red-500' : 'bg-white'
                    }`}
                    onPress={recording ? stopRecording : startRecording}
                    style={{
                        shadowColor: recording ? '#EF4444' : '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Ionicons
                        name={recording ? "stop" : "mic"}
                        size={32}
                        color={recording ? "white" : "#1F2937"}
                    />
                </TouchableOpacity>

                {recording && (
                    <View className="items-center mt-4">
                        <WaveformVisualizer />
                        <View className="bg-black/80 rounded-full px-4 py-2 mt-3">
                            <Text className="text-white font-medium text-sm">
                                Recording {formatDuration(recordingDuration)}
                            </Text>
                        </View>
                    </View>
                )}

                {!recording && recordings.length < 5 && (
                    <Text className="text-gray-500 text-sm mt-3 text-center">
                        Tap to record • {5 - recordings.length} remaining
                    </Text>
                )}
            </View>

            {/* Recordings List */}
            {recordings.length > 0 && (
                <View className="w-full space-y-3">
                    <Text className="text-gray-700 font-semibold mb-2">
                        Recorded Notes ({recordings.length}/5)
                    </Text>

                    {recordings.map((uri, index) => (
                        <View
                            key={index}
                            className="bg-white/80 rounded-2xl p-4 shadow-sm border border-white/50"
                        >
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1">
                                    <TouchableOpacity
                                        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${
                                            isPlaying[index] ? 'bg-gray-900' : 'bg-gray-100'
                                        }`}
                                        onPress={() => togglePlayback(index)}
                                    >
                                        <Ionicons
                                            name={isPlaying[index] ? "pause" : "play"}
                                            size={18}
                                            color={isPlaying[index] ? "white" : "#374151"}
                                        />
                                    </TouchableOpacity>

                                    <View className="flex-1">
                                        <Text className="text-gray-900 font-semibold">
                                            Voice Note {index + 1}
                                        </Text>
                                        <Text className="text-gray-500 text-sm">
                                            Duration: {formatDuration(durations[index])}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() => deleteRecording(index)}
                                    className="w-10 h-10 rounded-full bg-red-50 items-center justify-center"
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            {/* Dynamic Progress Bar */}
                            {isPlaying[index] && (
                                <View className="mt-3">
                                    <View className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                        <LinearGradient
                                            colors={['#374151', '#1F2937']}
                                            className="h-full rounded-full"
                                            style={{ width: `${(playbackProgress[index] || 0) * 100}%` }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
