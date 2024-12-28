import started from "electron-squirrel-startup";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

import {app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent, session, shell} from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises'
import {execFile} from "node:child_process";
import {parse, stringify} from 'ini'
import {updateElectronApp} from "update-electron-app";
import * as util from "node:util";
import {initProtocolHandler} from "./protocolHandler";

if (app.isPackaged) {
  updateElectronApp();
}

initProtocolHandler();

export let mainWindow: BrowserWindow;

const createWindow = () => {
  gmpSettings.lang = app.getLocale().split('-')[0];
  initConfigs();
  setCSP();

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: settings.window.width,
    height: settings.window.height,
    x: settings.window.x,
    y: settings.window.y,
    minWidth: 400,
    minHeight: 200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    icon: "./images/icon.png",
    backgroundColor: "#212529",
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: "#00000000",
      symbolColor: "#dee2e6",
      // Needs to be the same as Header height
      height: 40
    },
  });

  if (settings.maximized) {
    mainWindow.maximize();
  }

  initEvents(mainWindow);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const settingsPath = `${app.getPath('userData')}/settings.json`;
const gmpSettingsPath = `${app.getPath('userData')}/gmp.ini`;
const favoritesPath = `${app.getPath('userData')}/favorites.json`;
const nicknamesPath = `${app.getPath('userData')}/nicknames.json`;
const gmpChatPath = `${app.getPath('userData')}/Chat`;
const clientPath = app.isPackaged ? `${process.cwd()}/resources/client` : `${process.cwd()}/client`;

async function handleSelectGothicPath() {
  const {canceled, filePaths} = await dialog.showOpenDialog({
    title: "Select Gothic path",
    defaultPath: settings.launcher.gothicPath,
    properties: ["openDirectory"],
  });
  if (canceled) {
    return settings.launcher.gothicPath;
  }
  const gothicPath = filePaths[0];
  // TODO: Validate directory
  return gothicPath;
}

async function handleOpenChatlogsFolder() {
  await fs.mkdir(gmpChatPath, { recursive: true });
  await shell.openPath(gmpChatPath);
}

async function handleSaveGmpSettings(_event: IpcMainInvokeEvent, settings: GmpSettings) {
  gmpSettings = settings;
  await saveGmpSettings();
}

async function handleSaveLauncherSettings(_event: IpcMainInvokeEvent, set: LauncherSettings) {
  settings.launcher = set;
  await saveSettings();
}

async function handleSaveFavorites(_event: IpcMainInvokeEvent, favs: string[]) {
  favoriteServers = favs;
  await saveFavorites();
}

async function handleSaveNickname(_event: IpcMainInvokeEvent, url: string, nickname: string) {
  nicknames = {...nicknames, [url]: nickname};
  await saveNicknames();
}

const asyncExecFile = util.promisify(execFile);

async function handleConnect(_event: IpcMainInvokeEvent, url: string, nickname: string, version: string) {
  if (settings.launcher.gothicPath.length === 0) {
    settings.launcher.gothicPath = await handleSelectGothicPath();
    if (settings.launcher.gothicPath.length === 0) {
      return { error: "Please select a valid path to Gothic in the Settings tab." };
    }
    await saveSettings();
  }
  // TODO: check gothic path validity
  const args = [
    `--gothic=${settings.launcher.gothicPath}/System/Gothic2.exe`,
    `--host=${url.replace(/^https?:\/\//, '')}`,
    `--nickname=${nickname}`,
    `--dll=${clientPath}/${version}/gmp.dll`
  ];
  if (settings.launcher.devMode) {
    if (settings.launcher.zSpyLevel > 0) {
      args.push(`--debug=${settings.launcher.zSpyLevel}`);
    }
    if (settings.launcher.enableGothicExceptionHandling) {
      args.push("--exception");
    }
  }
  try {
    const {stderr} = await asyncExecFile(`${clientPath}/gmpinjector`, args, { windowsHide: true });
    if (stderr) {
      return { error: stderr };
    }
  } catch (error) {
    let errorText = "unknown";
    if (error instanceof Error) {
      errorText = (error as Error & {stderr: string}).stderr;
    }
    return { error: errorText };
  }
  
  return {};
}

async function handleMinimize() {
  mainWindow.minimize();
}

async function getAvailableVersions() {
  return (await fs.readdir(clientPath, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
}

async function getGmpSettings() {
  return gmpSettings;
}

async function getLauncherSettings() {
  return settings.launcher;
}

async function getFavoriteServers() {
  return favoriteServers;
}

function getNickname(_event: IpcMainInvokeEvent, url: string) {
  return nicknames[url];
}

async function saveSettings() {
  await fs.writeFile(settingsPath, JSON.stringify(settings));
}

async function saveGmpSettings() {
  await fs.writeFile(gmpSettingsPath, stringify(gmpSettings), "ascii");
}

async function saveFavorites() {
  await fs.writeFile(favoritesPath, JSON.stringify(favoriteServers));
}

async function saveNicknames() {
  await fs.writeFile(nicknamesPath, JSON.stringify(nicknames));
}

let gmpSettings: GmpSettings = {
  lang: "en",
  chatlines: 10,
  chatlog: false,
  toggleWalkmode: true,
  disableCapslockInChat: false,
}

let settings: Settings = {
  window: {
    x: undefined,
    y: undefined,
    width: 1024,
    height: 768
  },
  maximized: false,
  launcher: {
    gothicPath: "",
    devMode: false,
    zSpyLevel: 9,
    enableGothicExceptionHandling: false,
    publicServerListUrl: "",
  }
}

let favoriteServers: string[] = [];

let nicknames: Record<string, string> = {};

async function initConfigs() {
  try {
    const data = await fs.readFile(settingsPath, 'utf8');
    const parsedData = JSON.parse(data);
    Object.keys(parsedData).forEach(key => {
      if (parsedData[key] === undefined || parsedData[key] === null) {
        delete parsedData[key];
      }
    });
    console.log("settings", parsedData);
    settings = {...settings, ...parsedData};
  } catch (err) {
    console.error(err);
  }

  try {
    const data = await fs.readFile(favoritesPath, 'utf8');
    const parsedData = JSON.parse(data);
    console.log("favorites", parsedData);
    favoriteServers = parsedData;
  } catch (err) {
    console.error(err);
  }

  try {
    const data = await fs.readFile(nicknamesPath, 'utf8');
    const parsedData = JSON.parse(data);
    console.log("nicknames", parsedData);
    nicknames = parsedData;
  } catch (err) {
    console.error(err);
  }

  try {
    const gmpData = await fs.readFile(gmpSettingsPath, 'ascii');
    const parsedGmpData = parse(gmpData);
    if (parsedGmpData.lang === undefined || typeof parsedGmpData.lang !== "string") {
      parsedGmpData.lang = gmpSettings.lang;
    }
    if (parsedGmpData.chatlines === undefined) {
      parsedGmpData.chatlines = parseInt(parsedGmpData.chatlines, 10) || gmpSettings.chatlines;
    }
    if (parsedGmpData.chatlog === undefined || typeof parsedGmpData.chatlog !== "boolean") {
      parsedGmpData.chatlog = gmpSettings.chatlog;
    }
    if (parsedGmpData.toggleWalkmode === undefined || typeof parsedGmpData.toggleWalkmode !== "boolean") {
      parsedGmpData.toggleWalkmode = gmpSettings.toggleWalkmode;
    }
    if (parsedGmpData.disableCapslockInChat === undefined || typeof parsedGmpData.disableCapslockInChat !== "boolean") {
      parsedGmpData.disableCapslockInChat = gmpSettings.disableCapslockInChat;
    }
    gmpSettings = parsedGmpData as GmpSettings;
    console.log("gmpSettings", gmpSettings);
  } catch (err) {
    console.error(err);
  }
}

function initEvents(mainWindow: BrowserWindow) {
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const allowedUrls = ["https://discord.gg", "https://github.com", "https://gitlab.com"];
    if (allowedUrls.some(u => url.startsWith(u))) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on("close", () => {
    if (!mainWindow.isMaximized()) {
      settings.window = mainWindow.getBounds();
    }
    settings.maximized = mainWindow.isMaximized();
    saveSettings();
  });

  ipcMain.handle("select-gothic-path", handleSelectGothicPath);
  ipcMain.handle("get-gmp-settings", getGmpSettings);
  ipcMain.handle("get-launcher-settings", getLauncherSettings);
  ipcMain.handle("get-app-version", async () => app.getVersion());
  ipcMain.handle("get-favorite-servers", getFavoriteServers);
  ipcMain.handle("connect-to-server", handleConnect);
  ipcMain.handle("minimize", handleMinimize);
  ipcMain.handle("get-available-versions", getAvailableVersions);
  ipcMain.handle("get-nickname", getNickname);
  ipcMain.on("open-folder", handleOpenChatlogsFolder);
  ipcMain.on("save-gmp-settings", handleSaveGmpSettings);
  ipcMain.on("save-launcher-settings", handleSaveLauncherSettings);
  ipcMain.on("save-favorite-servers", handleSaveFavorites);
  ipcMain.on("save-nickname", handleSaveNickname);
}

function setCSP() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          'script-src \'self\'',
          'object-src \'none\'',
          'base-uri \'none\''
        ]
      }
    })
  });
}
