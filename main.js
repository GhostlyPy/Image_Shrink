const { app, BrowserWindow } = require("electron");

// Defines the main application window
let mainWindow;

// Creates the main application window that will be opened during execution
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: 500,
    height: 600,
    icon: "./assets/icons/Icon_256x256.png",
  });

  // Links the HTML file to the JS file so that the application will have displayed content
  mainWindow.loadFile("./app/index.html");
}

// Opens/Creates the window that displays the application
app.on("ready", createMainWindow);
