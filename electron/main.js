const { app, BrowserWindow } = require('electron')
const path = require('path')

// Determine if we're in dev or production
const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 800,
    minWidth: 380,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#07070f',
      symbolColor: '#ffffff',
      height: 36
    },
    backgroundColor: '#07070f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icon.png'),
  })

  if (isDev) {
    win.loadURL('http://localhost:5173/wuwa-tower-guide/')
    // win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
