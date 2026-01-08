export interface HistoryItem {
    id: number;
    name: string;
    fan: number;
    date: string;
}

export interface UserStats {
    totalFan: number;
    totalRaces: number;
    totalWins: number;
    goalForWeek: number;
    // Others based on wireframe
    careers: number;
    goodEndings: number;
    club: string;
    // Profile Fields
    name: string;
    uid: string;
    email: string;
    // Notification Fields
    notificationEnabled: boolean;
    notificationTime: string;
}

export interface FormData {
    umaName: string;
    totalRaces: number;
    totalWins: number;
    totalFan: number;
    time: string;
    date: string;
}
