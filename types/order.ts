// types/order.ts

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
    id: string;
    boutiqueId: string;
    type: string;
    description: string;
    ordered: string;
    price: string;
    status: OrderStatus;
    statusColor: string;
    image?: string;
};
