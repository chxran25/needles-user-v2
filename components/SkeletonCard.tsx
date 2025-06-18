import { View } from "react-native";

export default function SkeletonCard() {
    return (
        <View className="bg-gray-100 rounded-xl overflow-hidden shadow-sm">
            <View className="w-full h-40 bg-gray-300 animate-pulse" />
            <View className="p-4 space-y-2">
                <View className="h-4 w-2/3 bg-gray-300 rounded-full animate-pulse" />
                <View className="h-3 w-1/2 bg-gray-200 rounded-full animate-pulse" />
                <View className="h-3 w-1/3 bg-gray-200 rounded-full animate-pulse" />
            </View>
        </View>
    );
}
