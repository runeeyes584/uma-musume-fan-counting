export interface ElectronAPI {
    getVersion: () => Promise<string>;
    saveData: (data: any) => Promise<{ success: boolean }>;
    loadData: () => Promise<any>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
