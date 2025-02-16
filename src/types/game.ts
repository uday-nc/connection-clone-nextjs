export interface Category {
    words: string[];
    name: string;
    color: string;
}

export interface GameState {
    words: string[];
    categories: Category[];
    selectedTiles: number[];
    foundCategories: Category[];
    mistakesRemaining: number;
}

export interface GameData {
    categories: Category[];
}
