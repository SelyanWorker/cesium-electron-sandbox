let cartpos = {
    lat: 0,
    lon: 0,
    height: 1000000,
    pitch: -57,
    roll: 0,
    heading: 0
};

const net_ = require('net');

let serverSocket;
let server = net_.createServer(function(socket)
{
    socket.pipe(socket)
    serverSocket = socket
});
server.listen(1337, '127.0.0.1');

const step = 0.01
setInterval(function()
{
    cartpos.lon += step
    //cartpos.lat += step
    //cartpos.height += step
    //cartpos.pitch += step
    //cartpos.roll += step
    //cartpos.heading += step
    if (serverSocket instanceof net_.Socket &&
        !serverSocket.isClosed)
        serverSocket.write(JSON.stringify(cartpos))
}, 100)