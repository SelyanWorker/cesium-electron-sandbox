function createFfmpeg(options_)
{
	let spawn = require('child_process').spawn

	let options = options_ || {}

	let ffmpegPath = options.ffmpeg || 'ffmpeg'
	let fps = options.fps || 60

	let args = [];
	// input params
	args.push('-f','image2pipe', '-r', '' + (+fps), '-i', 'pipe:.jpeg' );
	/*args.push('-y', '-f','rawvideo', '-framerate', '60', '-pix_fmt', 'bgr24', '-s:v', '600x600',
			  '-framerate', '60',
			  '-i', 'pipe:0' );*/

	// convert params
	args.push('-c:v', 'libx264' , '-g', '1', '-pix_fmt', 'yuv420p',
			'-profile:v', 'baseline', '-preset', 'ultrafast',	
			'-tune', 'zerolatency');
	
	
	// output params
	/*args.push(//'-c', 'copy', 
			  '-map', '0', 
			  '-segment_time', '00:01:00',
			  '-f', 'segment', 
			  '-reset_timestamps', '1',
			  'output%03d.mp4');*/

	
	// output params
	args.push('-f', 'mpegts');

	if (options.output) {
		args.push(options.output)
	} else {
		args.push('udp://127.0.0.1:23000')
	}
	
	//args.push('test.mp4');
	
	console.log(args)
	console.log(ffmpegPath)

	var ffmpeg = spawn(ffmpegPath, args)
	
	ffmpeg.stderr.on('data', data => {
	  console.error(`stderr: ${data}`);
	});
	
	function appendFrame_(jpegImage)
	{
		ffmpeg.stdin.write(jpegImage)
	}
	
	function closeStream_()
	{
		ffmpeg.stdin.end();
	}
	
	var result = {
		appendFrame: appendFrame_,
		closeStream: closeStream_
	}
	
	return result
}

function offscreenNetworkStream(ffmpegPath, htmlPage, winWidth, winHeight)
{
	const { app, BrowserWindow } = require("electron")
	const performanceNow = require("performance-now")
	
	let ffmpeg = createFfmpeg({ffmpeg: ffmpegPath,
								fps: 60 });

	app.whenReady().then(() => {
		let win = new BrowserWindow({ 
			webPreferences: 
			{
				offscreen: true
			} 
		});

		win.setSize(winWidth, winHeight)

		win.loadURL('file://' + htmlPage)
		
		const times = [];
		const outputDelay = 1000;
		let lastOutputTime = 0;
		let fps;
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
					
			let jpegImage = image.toJPEG(100);
			ffmpeg.appendFrame(jpegImage)
		});
		win.webContents.setFrameRate(60)

		win.show()
	})
}

module.exports = offscreenNetworkStream