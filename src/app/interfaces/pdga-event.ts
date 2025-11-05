export interface PdgaEvent {
    id: number;
    name: string;
    displayName: string;
    tier: string;
    date: Date;
    numberDays: number,
    city: string;
    country: string;
    numberPlayers: number;
    points: number;
    purse: number;
    isChampionship: boolean;
    isSwisstour: boolean;
    hasResults: boolean;
}
