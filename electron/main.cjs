const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("node:path");

let petWindow;

const createPetWindow = () => {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  petWindow = new BrowserWindow({
    width: 290,
    height: 405,
    x: Math.max(24, width - 330),
    y: Math.max(24, height - 455),
    transparent: true,
    frame: false,
    resizable: false,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: true,
    title: "PetFit Buding",
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    petWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}?mode=pet`);
  } else {
    petWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"), {
      query: { mode: "pet" },
    });
  }

  petWindow.once("ready-to-show", () => {
    petWindow.show();
  });
};

app.whenReady().then(() => {
  createPetWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createPetWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("petfit:close", () => {
  petWindow?.close();
});

ipcMain.handle("petfit:minimize", () => {
  petWindow?.minimize();
});

ipcMain.handle("petfit:toggle-always-on-top", () => {
  if (!petWindow) {
    return false;
  }

  const nextValue = !petWindow.isAlwaysOnTop();
  petWindow.setAlwaysOnTop(nextValue);
  return nextValue;
});
