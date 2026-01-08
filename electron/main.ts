import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { loadData, saveData } from './db.js'; // Import from db

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// ... (window creation code stays same)

// IPC Handlers
ipcMain.handle('get-version', () => app.getVersion());

ipcMain.handle('save-data', async (event, data) => {
    try {
        saveData(data);
        console.log('Data saved to SQLite');
        return { success: true };
    } catch (error) {
        console.error('Failed to save data:', error);
        return { success: false, error };
    }
});

ipcMain.handle('load-data', async () => {
    try {
        return loadData();
    } catch (error) {
        console.error('Failed to load data:', error);
        return null;
    }
});


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true, // Hide menu bar for cleaner look
        titleBarStyle: 'default', // standard title bar for now (can custom later)
        backgroundColor: '#1E1E2E', // Match standard dark theme
    });

    // In production, load the index.html.
    // In development, load the local dev server.
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


