const TelemetryReceiver = require('./telemetry_receiver/telemetry-receiver')
const { app, BrowserWindow } = require('electron')

app.whenReady().then(() =>
{
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:
        {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.on('closed', function () {
        app.quit();
    });

    let tr = new TelemetryReceiver()
    tr.setPositionCallback((position) =>
    {
        if (!win.isDestroyed())
            win.webContents.send('updatePosition', position);
    })
    tr.setOrientationCallback((orientation) =>
    {
        if (!win.isDestroyed())
            win.webContents.send('updateOrientation', orientation);
    })

    win.loadFile(__dirname + '/example/cesium-camera/camera.html')
    win.webContents.setFrameRate(60)

    win.show()
})
