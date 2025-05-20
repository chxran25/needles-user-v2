import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { BlurView } from "expo-blur";

export default function SkeletonCard() {
    return (
        <Skeleton.Group show>
            <BlurView
                intensity={20}
                tint="dark"
                className="rounded-2xl overflow-hidden mb-4"
            >
                <View className="p-4 bg-white/60">
                    <View className="flex-row space-x-4">
                        <Skeleton
                            height={120}
                            width={90}
                            radius={12}
                            colorMode="light"
                            transition={{ type: "timing", duration: 1000 }}
                        />

                        <View className="flex-1 justify-between py-1 space-y-2">
                            <Skeleton height={20} width="70%" radius={8} colorMode="light" />
                            <Skeleton height={14} width="85%" radius={8} colorMode="light" />
                            <Skeleton height={14} width="60%" radius={8} colorMode="light" />
                            <Skeleton height={18} width="40%" radius={8} colorMode="light" />
                        </View>
                    </View>
                </View>
            </BlurView>
        </Skeleton.Group>
    );
}
