// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import {contextBridge, ipcRenderer} from 'electron';

export const electronApi: ElectronAPI = {
    selectGothicPath: (currentPath: string) => ipcRenderer.invoke('select-gothic-path', currentPath),
    openChatlogsFolder: () => ipcRenderer.send('open-folder'),
    getGmpSettings: () => ipcRenderer.invoke('get-gmp-settings'),
    getLauncherSettings: () => ipcRenderer.invoke('get-launcher-settings'),
    saveGmpSettings: (settings: GmpSettings) => ipcRenderer.send('save-gmp-settings', settings),
    saveLauncherSettings: (settings: LauncherSettings) => ipcRenderer.send('save-launcher-settings', settings),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
};

contextBridge.exposeInMainWorld('electronAPI', electronApi);