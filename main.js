const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // serve in sviluppo per Expo Web
    },
  });

  win.loadFile(path.join(__dirname, "dist/index.html"));
  win.webContents.openDevTools(); // utile per debug
}

app.whenReady().then(createWindow);
