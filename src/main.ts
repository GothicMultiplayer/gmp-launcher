import {app, session, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent, shell, protocol} from 'electron';
import path from 'node:path';
import started from "electron-squirrel-startup";
import fs from 'node:fs/promises'
import {parse, stringify} from 'ini'
import {updateElectronApp} from "update-electron-app";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

if (app.isPackaged) {
  updateElectronApp();
}

const createWindow = () => {
  initConfigs();
  setCSP();

  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
    icon: "./images/icon.png"
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
const gmpUserDataPath = path.normalize(`${app.getPath('userData')}/../GothicMultiplayer`);
const gmpSettingsPath = `${gmpUserDataPath}/gmp_config.cfg`;

async function handleSelectGothicPath(_event: IpcMainInvokeEvent, currentPath: string) {
  const {canceled, filePaths} = await dialog.showOpenDialog({
    title: "Select Gothic path",
    defaultPath: currentPath,
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
  const chatlogsPath = `${gmpUserDataPath}/Chat`;
  await fs.mkdir(chatlogsPath, { recursive: true });
  await shell.openPath(chatlogsPath);
}

async function handleSaveGmpSettings(_event: IpcMainInvokeEvent, settings: GmpSettings) {
  gmpSettings = settings;
  await saveGmpSettings();
}

async function handleSaveLauncherSettings(_event: IpcMainInvokeEvent, set: LauncherSettings) {
  if (settings.launcher !== set) {
    settings.launcher = set;
    await saveSettings();
  }
}

async function getGmpSettings() {
  return gmpSettings;
}

async function getLauncherSettings() {
  return settings.launcher;
}

async function saveSettings() {
  await fs.writeFile(settingsPath, JSON.stringify(settings));
}

async function saveGmpSettings() {
  await fs.writeFile(gmpSettingsPath, stringify(settings), "ascii");
}

let gmpSettings: GmpSettings = {
  lang: 0,
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
    const gmpData = await fs.readFile(gmpSettingsPath, 'ascii');
    const parsedGmpData = parse(gmpData);
    gmpSettings.lang = parseInt(parsedGmpData.lang, 10) || gmpSettings.lang;
    gmpSettings.chatlines = parseInt(parsedGmpData.chatlines) || gmpSettings.chatlines;
    gmpSettings.chatlog = (parsedGmpData.chatlog ?? gmpSettings.chatlog.toString()) === "1";
    gmpSettings.toggleWalkmode = (parsedGmpData.toggleWalkmode ?? gmpSettings.toggleWalkmode.toString()) === "1";
    gmpSettings.disableCapslockInChat = (parsedGmpData.disableCapslockInChat ?? gmpSettings.disableCapslockInChat.toString()) === "1";
    console.log("gmpSettings", gmpSettings);
  } catch (err) {
    console.error(err);
  }
}

const protocolScheme = "gmp";

if (app.isPackaged) {
  app.setAsDefaultProtocolClient(protocolScheme);
  console.log("custom protocol exe set to", process.execPath);
}

app.whenReady().then(() => {
  protocol.handle(protocolScheme, (request) => {
    const { pathname } = new URL(request.url);
    const connectParam = "connect/";
    if (pathname.startsWith(connectParam)) {
      const connectTo = pathname.slice(connectParam.length);
      console.log('protocol', connectTo);
      return new Response(connectTo, {
        status: 201,
        headers: { 'content-type': 'text/html' }
      })
    }

    console.error('protocol error');
    return new Response(null, {
      status: 400,
    })
  });
})

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
  ipcMain.on("open-folder", handleOpenChatlogsFolder);
  ipcMain.on("save-gmp-settings", handleSaveGmpSettings);
  ipcMain.on("save-launcher-settings", handleSaveLauncherSettings);
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
