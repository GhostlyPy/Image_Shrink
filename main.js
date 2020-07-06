const { app, BrowserWindow } = require("electron");

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: 500,
    height: 600,
  });

  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}

app.on("ready", createMainWindow);
