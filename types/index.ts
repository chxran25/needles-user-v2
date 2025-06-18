export type DressType = {
    type: string;
    images?: string[];
    _id?: string;
    measurementRequirements: string[];
};

export type RecommendedDressType = {
    label: string;
    imageUrl?: string;
    count?: number;
    relevance?: number;
};

export type Boutique = {
    _id: string;
    name: string;
    area: string;
    headerImage?: string | string[];
    gallery?: string[];
    averageRating: number;
    dressTypes?: DressType[];
};

export type CatalogueItem = {
    itemName: string;
    price: number;
};
