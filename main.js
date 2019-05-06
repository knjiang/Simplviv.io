const { app, BrowserWindow } = require('electron')

function createWindow () {
    // Create the browser window.
    let win = new BrowserWindow({ width: 820, height: 635 })

    // and load the index.html of the app.
    win.loadURL("http://localhost:8081");
}

app.on('ready', createWindow)