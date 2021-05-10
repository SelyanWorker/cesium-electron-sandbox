const { app, BrowserWindow } = require('electron')
const performanceNow = require("performance-now")

app.whenReady().then(() => {
	
	let win = new BrowserWindow({ 
		webPreferences: 
		{
		} 
	});
	
	win.setSize(1920, 1080)
	const times = [];
	const outputDelay = 1000;
	let lastOutputTime = 0;
	let fps;
	win.loadURL('file://' + __dirname + '/example/cesium-plain/plain.html')
	win.webContents.on('paint', (event, dirty, image) => {
		const now = performanceNow();
		while (times.length > 0 && times[0] <= now - 1000) {
		  times.shift();
		}
		times.push(now);
		fps = times.length;
		if (times[times.length - 1] - lastOutputTime >= outputDelay)
		{
			lastOutputTime = times[times.length - 1];
			console.log(fps);
		}
	});
	win.webContents.setFrameRate(60)

	win.show()
})