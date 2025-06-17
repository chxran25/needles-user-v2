// app/types/index.ts

export type DressType = {
    type: string;
    images?: string[];
    _id?: string;
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
    averageRating: number;
    dressTypes?: DressType[];
};
