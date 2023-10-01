const { app, BrowserWindow, Menu} = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

// Menu Template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
            }
        ]
    }] : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label: 'About',
            }
        ]
    }] : [])
];


// Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Just Billing',
        width: 500,
        height: 600,
    });

    // Open dev tools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));

    // Maximize the window when it's ready
    mainWindow.on('ready-to-show', () => {
        mainWindow.maximize();
    });

    mainWindow.on('closed', () => {
        if (mainWindow) {
            mainWindow = null;
        }
    });
}

// App is up and running
app.whenReady().then(() => {
    createMainWindow();

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});
