const offscreenNetworkStream = require('./stream/offscreen-network-stream')

offscreenNetworkStream("./ffmpeg/bin/ffmpeg.exe", 
					   __dirname + '/example/cesium-plain/plain.html',
					   1280, 720);