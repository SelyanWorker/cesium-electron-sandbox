const net_ = require('net');

class TelemetryReceiver
{
    constructor()
    {
        this.#socket = new net_.Socket();
        this.#socket.connect(1337, '127.0.0.1', () =>
        {
            console.log('Connected')
        });

        this.#socket.on('data', (data) =>
        {
            try
            {
                let object = JSON.parse(data)
                this.#positionCallback(
                    {
                        longitude: object.lon,
                        latitude: object.lat,
                        height: object.height
                    })
                this.#orientationCallback(
                    {
                        pitch: object.pitch,
                        roll: object.roll,
                        heading: object.heading
                    })
            }
            catch (e)
            {
                console.log(e.message)
            }
        });

        this.#socket.on('close', () =>
        {
            console.log('Connection closed')
        });
    }

    setPositionCallback(positionCallback)
    {
        this.#positionCallback = positionCallback
    }

    setOrientationCallback(orientationCallback)
    {
        this.#orientationCallback = orientationCallback
    }

    #positionCallback
    #orientationCallback
    #socket
}

module.exports = TelemetryReceiver