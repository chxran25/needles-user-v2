export const boutiques = [
    {
        id: "1",
        name: "Tattva Fashions",
        image:
            "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        description: "Welcome to Tattva Fashions, where tradition meets innovation!",
        rating: 5,
        categories: ["Lehengas", "Magenta", "Blouses", "Dresses"],
        portfolio: [
            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1583391733981-8498c62f141b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1610189276290-90a551271fb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        ],
    },
    {
        id: "2",
        name: "Kurti Couture",
        image:
            "https://images.unsplash.com/photo-1582719478250-04fcbf3ed8b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        description:
            "Elegant kurtis with a twist of contemporary fusion. Stylish, versatile, and tailor-made.",
        rating: 4.8,
        categories: ["Kurtis", "Fusion", "Festive"],
        portfolio: [
            "https://images.unsplash.com/photo-1610196031374-cba3d89c5821?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1589987600377-52c9f31fe017?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1572294431520-12158c75030f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        ],
    },
    {
        id: "3",
        name: "Lehanga Leaf",
        image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        description:
            "Royal lehengas curated with intricate handwork and the finest fabrics. Perfect for the modern bride.",
        rating: 4.9,
        categories: ["Lehengas", "Bridal", "Luxury"],
        portfolio: [
            "https://images.unsplash.com/photo-1612499613995-8794ed2fbfc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1622495893590-21a91447ff93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1611573999130-66b57aebc45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        ],
    },
];

export const categories = [
    "Lehengas",
    "Magenta",
    "Blouses",
    "Dresses",
    "Ethnic",
    "Bridal",
    "Western",
    "Casual",
    "Kurtis",
    "Fusion",
    "Luxury",
    "Festive",
];

export type BoutiqueType = {
    id: string;
    name: string;
    image: string;
    description: string;
    rating: number;
    categories: string[];
    portfolio: string[];
};
