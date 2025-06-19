// Common base fields for all orders
// type BaseOrder = {
//     orderId: string;
//     boutiqueName: string;
//     referralImage?: string;
// };
//
// // Main order tabs
// export type PendingOrder = BaseOrder & {
//     amount: number;
//     status: "Pending" | "Not Paid" | "Paid";
// };
//
// export type PaidOrder = BaseOrder & {
//     amount: number;
//     status: "Paid";
//     items: {
//         itemName: string;
//         price: number;
//     }[];
// };
//
// // Alteration tab type
// export type AlterationOrder = {
//     orderId: string;
//     boutiqueName: string;
//     status: "Alteration";
//     issueDescription: string;
//     orderImage?: string;
//     referenceImage?: string;
//     voiceNoteUrl?: string;
// };

export type OrderStatus = "Pending" | "Paid" | "Not Paid" | "Completed";


export interface Order {
    id: string;
    status: OrderStatus;
    location?: string; // ✅ Add this line
    boutiqueName: string;
    boutiqueId: string; // ✅ Required for rating API
    imageUrl: string;
    dressType: string;
    price: number;
    deliveryDate: string;
}
