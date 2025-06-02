const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

async function createWindow () {
    const isDev = await import('electron-is-dev');

    mainWindow = new BrowserWindow({
        width: 1500,
        height: 1024,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Optional for secure context
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const startURL = isDev.default
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => (mainWindow = null));
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
