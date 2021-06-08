const path = require("path");
const os = require("os");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const slash = require("slash");
const log = require("electron-log");

// Sets Environment
process.env.NODE_ENV = "production";

// Checks to see if the environment is set to Development or Production
const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

// Defines the main application window
let mainWindow;
let aboutWindow;

// Creates the main application window that will be opened during execution
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev ? true : false,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Links the HTML file to the JS file so that the application will have displayed content
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}
// Creates a window that displays who created the application + the version of the application
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About Image Shrink",
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
    backgroundColor: "white",
  });

  // Links the HTML file to the JS file so that the application will have displayed content
  aboutWindow.loadURL(`file://${__dirname}/app/about.html`);
}

// Opens/Creates the window that displays the application
app.on("ready", () => {
  createMainWindow();

  // Used to customize the applications shortcuts & menu items
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("closed", () => (mainWindow = null));
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+W",
        click: () => app.quit(),
      },
    ],
  },
  ...(!isMac
    ? [
        {
          label: "About",
          submenu: [
            {
              label: "About",
              accelerator: "CmdOrCtrl+H",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            {
              role: "reload",
            },
            {
              role: "forcereload",
            },
            {
              type: "separator",
            },
            {
              role: "toggledevtools",
            },
          ],
        },
      ]
    : []),
];

ipcMain.on("image:minimize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageshrink");
  shrinkImage(options);
  console.log(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({
          quality,
        }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });

    log.info(files);

    shell.openPath(dest);

    mainWindow.webContents.send("image:done");
  } catch (err) {
    log.error(err);
  }
}

/* Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q. */
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  /* On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open. */
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
