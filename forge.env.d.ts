/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
/// <reference types="vite-plugin-svgr/client" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

declare interface ElectronAPI {
    selectGothicPath: () => Promise<string>;
    openChatlogsFolder: () => Promise<void>;
    getGmpSettings: () => Promise<GmpSettings>;
    getLauncherSettings: () => Promise<LauncherSettings>;
    getFavoriteServers: () => Promise<string[]>;
    getNickname: (url: string) => Promise<string>;
    saveGmpSettings: (settings: GmpSettings) => Promise<void>;
    saveLauncherSettings: (settings: LauncherSettings) => Promise<void>;
    saveFavoriteServers: (favorites: string[]) => Promise<void>;
    saveNickname: (url: string, nickname: string) => void;
    getAvailableVersions: () => Promise<string[]>;
    getAppVersion: () => Promise<string>;
    connectToServer: (url: string, nickname: string, version: string) => Promise<Result>;
    minimize: () => Promise<void>;
}

declare interface Window {
    electronAPI: ElectronAPI,
}

declare interface Result {
    error?: string;
}

declare interface LauncherSettings {
    gothicPath: string,
    devMode: boolean,
    zSpyLevel: number,
    enableGothicExceptionHandling: boolean,
    publicServerListUrl: string,
}

declare interface Settings {
    window: {
        x?: number,
        y?: number,
        width: number,
        height: number
    },
    maximized: boolean,
    launcher: LauncherSettings,
}

declare interface GmpSettings {
    lang: string,
    chatlines: number,
    chatlog: boolean,
    toggleWalkmode: boolean,
    disableCapslockInChat: boolean,
}
