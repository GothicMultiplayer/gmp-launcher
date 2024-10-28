/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
/// <reference types="vite-plugin-svgr/client" />

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

declare interface ElectronAPI {
    selectGothicPath: (str: string) => Promise<string>;
    openChatlogsFolder: () => Promise<void>;
    getGmpSettings: () => Promise<GmpSettings>;
    getLauncherSettings: () => Promise<LauncherSettings>;
    saveGmpSettings: (settings: GmpSettings) => Promise<void>;
    saveLauncherSettings: (settings: LauncherSettings) => Promise<void>;
    getAppVersion: () => Promise<string>;
}

declare interface Window {
    electronAPI: ElectronAPI,
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
    lang: number,
    chatlines: number,
    chatlog: boolean,
    toggleWalkmode: boolean,
    disableCapslockInChat: boolean,
}
