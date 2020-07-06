const { app, BrowserWindow } = require("electron");

// Sets Environment
process.env.NODE_ENV = "development";

// Checks to see if the environment is set to Development or Production
const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isWin = process.platform === "win32" ? true : false;

// Defines the main application window
let mainWindow;

// Creates the main application window that will be opened during execution
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev ? true : false,
  });

  // Links the HTML file to the JS file so that the application will have displayed content
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}

// Opens/Creates the window that displays the application
app.on("ready", createMainWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
