const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const config = require("./config");
const Server = require("./server");

const server = new Server(config.server.port);
app.commandLine.appendSwitch("ppapi-flash-path", __dirname + config.ppapiFlash.path);
app.commandLine.appendSwitch("ppapi-flash-version", config.ppapiFlash.version);

app.on("ready", () => {
  let mainWindow = new BrowserWindow({
    title: config.window.title,
    width: config.window.width,
    height: config.window.height,
    webPreferences: {
      plugins: true,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.openDevTools();

  globalShortcut.register("f5", () => {
    mainWindow.webContents.reload();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    //mainWindow.webContents.executeJavaScript("Dropzone.autoDiscover = false;");
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.loadURL(config.window.url);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
