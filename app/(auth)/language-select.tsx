import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelectScreen() {
    const router = useRouter();

    const languages = [
        { label: "Hello", code: "en" },
        { label: "నమస్తే", code: "te" },
        { label: "नमस्ते", code: "hi" },
    ];

    const handleLanguageSelect = (langCode: string) => {
        router.push("/(auth)/login");
    };

    return (
        <SafeAreaView className="flex-1 bg-[#FFF2D7] justify-center px-6">
            <Text className="text-4xl font-bold text-center text-black mb-10">Needles</Text>
            <Text className="text-lg text-center text-black mb-6">Choose a language</Text>

            {languages.map(({ label, code }) => (
                <Pressable
                    key={code}
                    className="bg-[#FFD580] py-4 rounded-xl mb-4 shadow-md"
                    onPress={() => handleLanguageSelect(code)}
                >
                    <Text className="text-center text-lg font-semibold text-black">{label}</Text>
                </Pressable>
            ))}

            <View className="mt-12 items-center">
                <Pressable onPress={() => router.push("/(auth)/login")} className="flex-row items-center">
                    <Ionicons name="person-outline" size={18} color="black" />
                    <Text className="ml-2 text-black font-medium">Login In/Sign Up</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
