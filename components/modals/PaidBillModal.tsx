import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { LinearGradient } from "expo-linear-gradient";
import {
    fetchBillDetails,
    markBillAsPaid,
    rejectBill,
} from "@/services/api";

interface NotPaidBillModalProps {
    orderId: string;
    onClose: () => void;
}

export default function NotPaidBillModal({ orderId, onClose }: NotPaidBillModalProps) {
    const [bill, setBill] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const load = async () => {
            try {
                const billData = await fetchBillDetails(orderId);
                setBill(billData);
            } catch (err) {
                toast.show("Failed to load bill details", { type: "danger" });
                onClose();
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [orderId]);

    const handlePay = async () => {
        try {
            await markBillAsPaid(orderId);
            toast.show("✅ Bill marked as Paid", { type: "success" });
            onClose();
        } catch (error: any) {
            toast.show(error?.response?.data?.message || "Payment failed", { type: "danger" });
        }
    };

    const handleReject = async () => {
        try {
            await rejectBill(orderId);
            toast.show("❌ Bill rejected", { type: "warning" });
            onClose();
        } catch (error: any) {
            toast.show(error?.response?.data?.message || "Rejection failed", { type: "danger" });
        }
    };

    if (!bill && loading) return null;

    return (
        <Modal transparent animationType="slide" onRequestClose={onClose}>
            <View className="flex-1 bg-black/60 justify-end">
                {/* Premium Gradient Background */}
                <LinearGradient
                    colors={["#f4e49c", "#faf7e8", "#ffffff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.modalContainer}
                >
                    {/* Header with decorative line */}
                    <View style={styles.header}>
                        <View style={styles.headerDecoration} />
                        <Text style={styles.headerTitle}>INVOICE</Text>
                        <View style={styles.headerDecoration} />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Boutique Name Section */}
                        <View style={styles.boutiqueSection}>
                            <Text style={styles.boutiqueLabel}>FROM</Text>
                            <Text style={styles.boutiqueName}>{bill?.boutiqueName}</Text>
                        </View>

                        {/* Order ID Section */}
                        <View style={styles.orderSection}>
                            <Text style={styles.sectionLabel}>Order Reference</Text>
                            <View style={styles.orderIdContainer}>
                                <Text style={styles.orderIdText}>{bill?.orderId}</Text>
                            </View>
                        </View>

                        {/* Items Section */}
                        <View style={styles.itemsSection}>
                            <Text style={styles.sectionTitle}>Service Details</Text>
                            <View style={styles.itemsContainer}>
                                {bill?.items && typeof bill.items === "object" ? (
                                    Object.entries(bill.items).map(([itemName, itemCost], idx) => (
                                        <View key={idx} style={styles.itemRow}>
                                            <View style={styles.itemNameContainer}>
                                                <Text style={styles.itemName}>{itemName}</Text>
                                            </View>
                                            <Text style={styles.itemCost}>₹{Number(itemCost).toFixed(2)}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noItemsText}>No services listed</Text>
                                )}
                            </View>
                        </View>

                        {/* Cost Breakdown Section */}
                        <View style={styles.breakdownSection}>
                            <Text style={styles.sectionTitle}>Cost Summary</Text>

                            <View style={styles.costRow}>
                                <Text style={styles.costLabel}>Additional Services</Text>
                                <Text style={styles.costValue}>
                                    ₹{bill?.additionalCost?.amount?.toFixed(2) ?? "0.00"}
                                </Text>
                            </View>

                            {bill?.additionalCost?.reason && (
                                <View style={styles.reasonContainer}>
                                    <Text style={styles.reasonText}>
                                        Note: {bill.additionalCost.reason}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.costRow}>
                                <Text style={styles.costLabel}>Delivery Charge</Text>
                                <Text style={styles.costValue}>₹{bill?.deliveryFee?.toFixed(2)}</Text>
                            </View>

                            <View style={styles.costRow}>
                                <Text style={styles.costLabel}>Platform Fee</Text>
                                <Text style={styles.costValue}>₹{bill?.platformFee?.toFixed(2)}</Text>
                            </View>

                            <View style={styles.costRow}>
                                <Text style={styles.costLabel}>GST (Inclusive)</Text>
                                <Text style={styles.costValue}>₹{bill?.gst?.toFixed(2)}</Text>
                            </View>

                            {/* Total Section */}
                            <View style={styles.totalSection}>
                                <LinearGradient
                                    colors={["#d4af37", "#f4e49c"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.totalGradient}
                                >
                                    <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                                    <Text style={styles.totalAmount}>₹{bill?.totalAmount?.toFixed(2)}</Text>
                                </LinearGradient>
                            </View>

                            {/* Status Badge */}
                            <View style={styles.statusContainer}>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{bill?.status?.toUpperCase()}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: "85%",
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 25,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
    },
    headerDecoration: {
        height: 1,
        flex: 1,
        backgroundColor: "#d4af37",
        marginHorizontal: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#8b5a2b",
        letterSpacing: 3,
        textAlign: "center",
    },
    scrollContent: {
        paddingBottom: 16,
    },
    boutiqueSection: {
        marginBottom: 28,
        alignItems: "center",
    },
    boutiqueLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#8b5a2b",
        letterSpacing: 1,
        marginBottom: 4,
    },
    boutiqueName: {
        fontSize: 28,
        fontWeight: "700",
        color: "#2d1810",
        textAlign: "center",
    },
    orderSection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#8b5a2b",
        letterSpacing: 1,
        marginBottom: 8,
    },
    orderIdContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.3)",
    },
    orderIdText: {
        fontSize: 14,
        fontFamily: "monospace",
        color: "#4a4a4a",
        textAlign: "center",
    },
    itemsSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2d1810",
        marginBottom: 16,
        textAlign: "center",
    },
    itemsContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.2)",
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(212, 175, 55, 0.2)",
    },
    itemNameContainer: {
        flex: 1,
        marginRight: 16,
    },
    itemName: {
        fontSize: 16,
        color: "#2d1810",
        fontWeight: "500",
    },
    itemCost: {
        fontSize: 16,
        fontWeight: "700",
        color: "#8b5a2b",
    },
    noItemsText: {
        fontSize: 16,
        color: "#8b7355",
        fontStyle: "italic",
        textAlign: "center",
        paddingVertical: 12,
    },
    breakdownSection: {
        marginBottom: 16,
    },
    costRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    costLabel: {
        fontSize: 16,
        color: "#4a4a4a",
        fontWeight: "500",
    },
    costValue: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2d1810",
    },
    reasonContainer: {
        backgroundColor: "rgba(251, 191, 36, 0.15)",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: "rgba(251, 191, 36, 0.3)",
    },
    reasonText: {
        fontSize: 14,
        color: "#8b5a2b",
        fontStyle: "italic",
        fontWeight: "500",
    },
    totalSection: {
        marginTop: 20,
        marginBottom: 16,
    },
    totalGradient: {
        borderRadius: 16,
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#d4af37",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "800",
        color: "#2d1810",
        letterSpacing: 1,
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: "900",
        color: "#2d1810",
    },
    statusContainer: {
        alignItems: "flex-end",
        marginTop: 12,
    },
    statusBadge: {
        backgroundColor: "#f97316",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        shadowColor: "#f97316",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#ffffff",
        letterSpacing: 1,
    },
    actionSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        borderRadius: 16,
        overflow: "hidden",
    },
    payButton: {
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonGradient: {
        paddingVertical: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    rejectButton: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        borderColor: "#ef4444",
        paddingVertical: 14,
        alignItems: "center",
    },
    rejectButtonText: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    closeButton: {
        marginTop: 16,
        paddingVertical: 14,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(212, 175, 55, 0.3)",
    },
    closeButtonText: {
        color: "#6b7280",
        fontSize: 16,
        fontWeight: "600",
    },
});