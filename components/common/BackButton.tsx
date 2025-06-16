import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

interface BackButtonProps {
    onPress?: () => void;
    className?: string;
    iconSize?: number;
    iconColor?: string;
}

export default function BackButton({ 
    onPress, 
    className = "absolute top-12 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg",
    iconSize = 20,
    iconColor = "black"
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
        <TouchableOpacity
            onPress={handlePress}
            className={className}
        >
            <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
        </TouchableOpacity>
    );
}