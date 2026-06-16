const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("petfitDesktop", {
  close: () => ipcRenderer.invoke("petfit:close"),
  minimize: () => ipcRenderer.invoke("petfit:minimize"),
  toggleAlwaysOnTop: () => ipcRenderer.invoke("petfit:toggle-always-on-top"),
});
