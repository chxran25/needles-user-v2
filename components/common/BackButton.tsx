import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";

interface BackButtonProps {
    onPress?: () => void;
    className?: string;
    iconSize?: number;
    iconColor?: string;
    previousScreenLabel?: string; // 🆕 New prop
}

export default function BackButton({
                                       onPress,
                                       className = "absolute top-12 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex-row items-center",
                                       iconSize = 20,
                                       iconColor = "black",
                                       previousScreenLabel, // 🆕
                                   }: BackButtonProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            router.back();
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} className={className}>
            <View className="flex-row items-center space-x-2">
                <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
                {previousScreenLabel && (
                    <Text className="text-base font-medium text-gray-800">
                        {previousScreenLabel}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}
