export const boutiques = [
    {
        id: "1",
        name: "Tattva Fashions",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMHN0b3JlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        description: "Welcome to Tattva Fashions, where tradition meets innovation!",
        rating: 5,
        categories: ["Lehengas", "Magenta", "Blouses", "Dresses"],
        portfolio: [
            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1583391733981-8498c62f141b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aW5kaWFuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1610189276290-90a551271fb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
        ]
    },
    {
        id: "2",
        name: "Miyapur store",
        image: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym91dGlxdWV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
        description: "Specialized in traditional and contemporary clothing for all occasions",
        rating: 4,
        categories: ["Ethnic", "Bridal"],
        portfolio: [
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aW5kaWFuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1583243567239-889264a72044?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aW5kaWFuJTIwZHJlc3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1583243567510-42cfa8999053?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGluZGlhbiUyMGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
        ]
    },
    {
        id: "3",
        name: "KPHB store",
        image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGJvdXRpcXVlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        description: "Your one-stop shop for trendy and fashionable custom clothing",
        rating: 4.5,
        categories: ["Western", "Casual"],
        portfolio: [
            "https://images.unsplash.com/photo-1616832880334-b1004d9808da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGluZGlhbiUyMGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1603487742131-4160ec999306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGluZGlhbiUyMGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
            "https://images.unsplash.com/photo-1611996575749-79a3a250f948?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGluZGlhbiUyMGRyZXNzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
        ]
    }
];

export const categories = [
    "Lehengas",
    "Magenta",
    "Blouses",
    "Dresses",
    "Ethnic",
    "Bridal",
    "Western",
    "Casual"
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