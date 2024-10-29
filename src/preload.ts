// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from 'electron';

export const electronApi: ElectronAPI = {
    selectGothicPath: () => ipcRenderer.invoke('select-gothic-path'),
    openChatlogsFolder: () => ipcRenderer.send('open-folder'),
    getGmpSettings: () => ipcRenderer.invoke('get-gmp-settings'),
    getLauncherSettings: () => ipcRenderer.invoke('get-launcher-settings'),
    getFavoriteServers: () => ipcRenderer.invoke('get-favorite-servers'),
    saveGmpSettings: (settings: GmpSettings) => ipcRenderer.send('save-gmp-settings', settings),
    saveLauncherSettings: (settings: LauncherSettings) => ipcRenderer.send('save-launcher-settings', settings),
    saveFavoriteServers: (favorites: string[]) => ipcRenderer.send('save-favorite-servers', favorites),
    getAvailableVersions: () => ipcRenderer.invoke('get-available-versions'),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    connectToServer: (url: string, nickname: string, version: string) => ipcRenderer.invoke('connect-to-server', url,  nickname, version),
    minimize: () => ipcRenderer.invoke('minimize'),
};

contextBridge.exposeInMainWorld('electronAPI', electronApi);