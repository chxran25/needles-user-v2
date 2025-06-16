import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';

type BackButtonProps = {
    label?: string;
    showText?: boolean;
    color?: string;
    iconSize?: number;
};

export default function BackButton({
                                       label = 'Back',
                                       showText = false,
                                       color = 'black',
                                       iconSize = 20,
                                   }: BackButtonProps) {
    const router = useRouter();
    const navigation = useNavigation();

    const handleBack = () => {
        // @ts-ignore – ignore TS error about isFocused
        if (navigation.canGoBack?.()) {
            router.back();
        } else {
            console.warn('🔁 No screen to go back to, going to Home');
            router.push('/');
        }
    };

    return (
        <TouchableOpacity
            onPress={handleBack}
            className="flex-row items-center"
            activeOpacity={0.8}
        >
            <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <Ionicons name="arrow-back" size={iconSize} color={color} />
            </View>
            {showText && (
                <Text className="ml-2 text-base font-medium text-gray-800">
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}
