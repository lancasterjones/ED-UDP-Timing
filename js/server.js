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
            //console.log("Ignore if " + ignoreString);


            var length = message.toString().trim().length;
            var messageCode = message.toString().trim().substring(0, 1);

            //console.log('Length: ' + length);
            this.element.appendMessage(message, rinfo)
            //console.log('Message Received: ' + message);

            //console.log('Position: ' + messageCode);

            if (message.toString().indexOf(ignoreString) > -1 && ignoreString.length > 1) {
                console.log("Row ignored");

            } else {
                //console.log("Not ignored");
                //console.log(message);

                // Ryegate Software //
                type = 'RUNN.';
                var messageIndex = message.toString().lastIndexOf('{') + 1;
                //console.log("Message Index: " + messageIndex);
                messageCode = message.toString().substr(messageIndex, 2).replace('{', '').replace('}', '');
                //console.log("Message Code: " + messageCode);

                // Mesagecode 23 -> Countdown

                // Messagecode 17 -> Running

                // Messagecode 8 -> Final

                // Messacode 18 -> Horse switch
                if (messageCode == 18) {
                    time = '45';
                    type = 'New Rider';
                    resetAddedTime();
                } else if (messageCode == 8) {
                    console.log('Final time');
                    type = 'FINAL';
                    var lastkey = message.toString().lastIndexOf('{') + 1;
                    time = message.toString().substr(lastkey - 7, 7).replace('}', '').replace('{', '');
                    if (time.indexOf('Elim') != -1) {
                        console.log('Eliminated');
                        time = '0';
                        type = 'ELIMINATED'
                    } else if (message.toString().indexOf('Ret') != -1) {
                        console.log('Retired');
                        type = 'FINAL';
                        time = '0';
                    }
                } else if (message.toString().indexOf('Elim') != -1) {
                    console.log('Eliminated');
                    type = 'FINAL';
                    time = '0';
                } else {
                    var lastkey = message.toString().lastIndexOf('}') + 1;
                    //console.log('Last Key');
                    //console.log(lastkey);
                    var timeString = message.toString().substr(lastkey, 5);
                    //console.log("Timestring");
                    //console.log(timeString);

                    if (timeString.indexOf('-') != -1) {
                        type = 'CD';
                        time = timeString.replace('-', '');
                        resetAddedTime();
                    } else if (timeString.indexOf('TA:') != -1) {
                        console.log('Ignore or white space');
                        time = '';
                    } else {
                        time = timeString;
                    }

                }

                time = Number.parseFloat(time) + addedTime;
                saveTime(time, type);


                // Broder Software //
                /*
                
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
                */

            }







        });

        this.render();
    }
}