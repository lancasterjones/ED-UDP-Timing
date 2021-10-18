/**
 * Server object with HTML element
 * @extends {Socket}
 */
class Server extends Socket {

    /**
     * Constructor
     * @param {String} local_address 
     * @param {Number} local_port 
     */
    constructor(local_address, local_port) {
        super(local_address, local_port);

        /**
         * Server element
         * @type {ServerElement}
         */
        this.element = document.createElement('udp-server');

        // On delete emit event upwards
        this.element.addEventListener('delete', (event) => {
            this.emit('delete');
        });
    }

    /**
     * Get the ServerElement
     * @returns {ServerElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * Remove the ServerElement
     */
    remove() {
        this.element.remove();
    }

    /**
     * Render the server's HTML element
     */
    render() {
        const addr = this.socket.address();
        this.element.setName(`${addr.address}:${addr.port}`);
    }

    /**
     * Initialize the server.
     * Render the element.
     * Attach handlers to the socket.
     * Socket must be set.
     */
    initialize() {
        if (!this.socket) {
            console.error('Server socket has not been set');
            return;
        }

        this.element.appendMessage(`Listening`);
        var type = '';
        var time;
        var ignoreString = document.getElementById('ignoreString').value;

        // On message append to the messages textarea
        this.socket.on('message', (message, rinfo) => {

            ignoreString = document.getElementById('ignoreString').value;
            console.log("Ignore if " + ignoreString);


            var length = message.toString().trim().length;
            var messageCode = message.toString().trim().substring(0, 1);

            console.log('Length: ' + length);
            this.element.appendMessage(message, rinfo)
            console.log('Message Received: ' + message);

            console.log('Position: ' + messageCode);

            if (message.toString().indexOf(ignoreString) > -1 && ignoreString.length > 1) {
                console.log("Row ignored");

            } else {
                console.log("Not ignored");
                console.log(messageCode);
                if (messageCode != '9') {
                    if (messageCode == '6') { // Countdown (falta validar con nombres de pruebas)
                        type = 'countdown';
                        time = message.toString().substring(109, 114).trim().replace('$', '');

                        // Quitar signo $ y caracteres posteriores
                    } else if (messageCode == '7') { // Round 1
                        console.log('running round 1');
                        time = message.toString().substring(109, 119).trim();
                        // checar si tiene decimales
                        if (time.indexOf('.') > -1) {
                            type = 'final';
                        } else {
                            type = 'running';
                        }

                    } else if (messageCode == '8') {
                        time = message.toString().substring(141, 149).trim();
                        // checar si tiene decimales
                        if (time.indexOf('.') > -1) {
                            type = 'final';
                        } else {
                            type = 'running';
                        }

                    }
                    saveTime(time, type);

                }

            }






        });

        this.render();
    }
}