const offscreenFileStream = require('./stream/offscreen-file-stream')

offscreenFileStream("./ffmpeg/bin/ffmpeg.exe", 
					   'file://' + __dirname + '/example/cesium-plain/plain.html',
					   1280, 1024);