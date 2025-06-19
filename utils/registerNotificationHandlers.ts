import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";
import { router } from "expo-router";

// Show notifications even in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function registerNotificationHandlers() {
    // Request permission and get token
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.warn("Permission not granted for notifications");
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("✅ Expo Push Token:", token);

        // TODO: Save token to backend via /User/save-token
        // await fetch("/User/save-token", { ... })

    } else {
        Alert.alert("Error", "Must use physical device for Push Notifications");
    }

    // App is foregrounded
    Notifications.addNotificationReceivedListener((notification) => {
        const orderId = notification.request.content.data?.orderId;
        console.log("📩 Notification received in foreground:", notification);

        Alert.alert(notification.request.content.title || "Notification", notification.request.content.body || "", [
            {
                text: "View",
                onPress: () => {
                    if (orderId) router.push("/orders");
                },
            },
            { text: "Dismiss", style: "cancel" },
        ]);
    });

    // App is opened via tapping notification
    Notifications.addNotificationResponseReceivedListener((response) => {
        const orderId = response.notification.request.content.data?.orderId;
        console.log("📬 Notification tapped:", orderId);
        if (orderId) {
            router.push("/orders");
        }
    });
}
