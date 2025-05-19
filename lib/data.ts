// File: lib/data.ts
import { Order } from "@/types/order";

export const data = [
    {
        id: "tattva-fashions",
        name: "Tattva Fashions",
        location: "Miyapur, Hyderabad",
        phone: "+919876543210", // ✅ Added
        tags: ["Lehengas", "Blouses", "Dresses"],
        description: "Welcome to Tattva Fashions, where tradition meets innovation!",
        image: require("@/assets/images/tattva.jpg"),
        rating: 4,
        gallery: [
            "https://via.placeholder.com/300x400?text=Tattva+1",
            "https://via.placeholder.com/300x400?text=Tattva+2",
            "https://via.placeholder.com/300x400?text=Tattva+3",
        ],
    },
    {
        id: "kurti-couture",
        name: "Kurti Couture",
        location: "Dilsukhnagar, Hyderabad",
        phone: "+919845612378", // ✅ Added
        tags: ["Kurtis", "Casual"],
        description: "Trendy kurtis for every occasion. Style your everyday!",
        image: require("@/assets/images/kurti-couture.jpg"),
        rating: 3,
        gallery: [
            "https://via.placeholder.com/300x400?text=Kurti+1",
            "https://via.placeholder.com/300x400?text=Kurti+2",
        ],
    },
    {
        id: "lehenga-leaf",
        name: "Lehenga Leaf",
        location: "Ameerpet, Hyderabad",
        phone: "+919912345678", // ✅ Added
        tags: ["Lehengas", "Bridal"],
        description: "Your dream lehenga lives here — bridal and festive perfection.",
        image: require("@/assets/images/lehenga-leaf.jpg"),
        rating: 5,
        gallery: [
            "https://via.placeholder.com/300x400?text=Lehenga+1",
            "https://via.placeholder.com/300x400?text=Lehenga+2",
        ],
    },
];

export const popularDressTypes = [
    {
        name: "Sarees",
        image: require("@/assets/images/saree.jpg"),
    },
    {
        name: "Lehengas",
        image: require("@/assets/images/lehenga.jpg"),
    },
    {
        name: "Blouses",
        image: require("@/assets/images/blouse.jpg"),
    },
    {
        name: "Kurtis",
        image: require("@/assets/images/kurti.jpg"),
    },
    {
        name: "Gowns",
        image: require("@/assets/images/gown.jpg"),
    },
    {
        name: "Dresses",
        image: require("@/assets/images/dress.jpg"),
    },
];

export const sampleOrders: Order[] = [
    {
        id: "32598",
        boutiqueId: "tattva-fashions",
        type: "Lehenga",
        description: "Sleeveless, side zip, extra flare",
        ordered: "May 14, 2025",
        price: "₹12,499",
        status: "Pending",
        statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
        id: "32581",
        boutiqueId: "kurti-couture",
        type: "Casual Kurti",
        description: "Printed, breathable cotton",
        ordered: "May 10, 2025",
        price: "₹1,499",
        status: "Shipped",
        statusColor: "bg-blue-100 text-blue-800",
    },
    {
        id: "32580",
        boutiqueId: "lehenga-leaf",
        type: "Bridal Lehenga",
        description: "Full embroidery, 3-layer flare",
        ordered: "May 02, 2025",
        price: "₹24,999",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800",
    },
    {
        id: "32579",
        boutiqueId: "kurti-couture",
        type: "Office Wear Kurti",
        description: "Straight cut, plain cotton",
        ordered: "Apr 28, 2025",
        price: "₹999",
        status: "Cancelled",
        statusColor: "bg-red-100 text-red-800",
    },
    {
        id: "32578",
        boutiqueId: "lehenga-leaf",
        type: "Bridal Dupatta",
        description: "Zari border, heavy net",
        ordered: "Apr 25, 2025",
        price: "₹2,799",
        status: "Shipped",
        statusColor: "bg-blue-100 text-blue-800",
    },
    {
        id: "32577",
        boutiqueId: "tattva-fashions",
        type: "Anarkali Gown",
        description: "Pastel green, full flare",
        ordered: "Apr 22, 2025",
        price: "₹6,499",
        status: "Delivered",
        statusColor: "bg-green-100 text-green-800",
    },
    {
        id: "32576",
        boutiqueId: "tattva-fashions",
        type: "Blouse",
        description: "Boat neck, padded",
        ordered: "Apr 18, 2025",
        price: "₹1,299",
        status: "Pending",
        statusColor: "bg-yellow-100 text-yellow-800",
    },
];
