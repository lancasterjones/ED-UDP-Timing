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
        var timer = 'pyramid';
        let jsonTime = '';

        // On message append to the messages textarea
        this.socket.on('message', (message, rinfo) => {
            //console.log('New message');

            if (timer == 'ryegate') {
                let originalString = message.toString().replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove special characters
                // console.log('Ryegate', originalString);

                // Convert to JSON
                let formatted = originalString.replace(/{/g, '{"').replace(/}/g, '":"').replace(/{/g, '",').replace(/^\",/, '');
                let jsonString = ('{').concat(formatted, '"}');
                //console.log('JSON:', jsonString);
                let json = JSON.parse(jsonString);

                // Mapping (Ryegate)
                let backNumber = json[1];
                let horse = json[2];
                let rider = json[3];
                let jumpFaults = json[14] ? json[14].replace('JUMP', '') : '';
                jsonTime = json[17] ? json[17] : json[23];
                let faultsDiv = document.getElementById('faults');
                let entryDiv = document.getElementById('entry');
                let riderDiv = document.getElementById('rider');
                faultsDiv.innerHTML = 'Faults: <span style="color:red">' + jumpFaults + '<span>';
                entryDiv.innerHTML = '<span style="color:red">' + backNumber + '</span> - ' + horse;
                riderDiv.innerHTML = rider;

                // Identify type
                if (jsonTime.toString().indexOf(".") != -1) {
                    type = 'FINAL';
                } else if (jsonTime.toString().indexOf("-") != -1) {
                    type = 'CD';
                } else {
                    type = 'RUNN.';
                };
            } else if (timer == 'pyramid') {
                /** Sample string 
                    007    11:31:04    502  518GUSTAVO PRATO                 KING VAN HET KEIZERSHOF          120                    73.02                   1     73.02$36,600 STALLER 1.45M SPEED 239                                                                                                            
                    007         Message code (if ending with 07, running or final time)
                    11:31:04    Time of Day
                    502         ????
                    518         Entry
                    Gustavo..   Rider
                    King Van..  Horse
                    120         Time Allowed
                    73.02       Rider Time
                    1           Rank
                    73.02       Total Time
                    $36,000...  Class Name

                    Sample 2
                    807    11:28:52    502  841SHAWN CASADY                  CAPTAIN JACK                     120                    80.33    8         8    4     88.33$36,600 STALLER 1.45M SPEED 239                                                                                                            
                    807         Message code (if ending with 07, running or final time)
                    11:28:52    Time of Day
                    502         ????
                    841         Entry
                    Shawn..     Rider
                    Captain...  Horse
                    120         Time Allowed
                    80.33       Rider Time
                    8           Faults ??
                    8           More faults ???
                    4           ???
                    1           Rank
                    73.02       Total Time
                    $36,000...  Class Name


                    Sample String CD
                    706    11:27:31    502  841SHAWN CASADY                  CAPTAIN JACK                     120                  26          $36,600 STALLER 1.45M SPEED 239                                                                                                                                     
                    706         Message Code (ending with 06 stands for countdown)
                    11:27:31    Time of Day
                    502         ???
                    841         Entry
                    Shawn...    Rider Name
                    Captain...  Horse Name
                    120         Time Allowed
                    26          Countdown time
                    $36,000     Class Name
                */
                let originalString = message.toString(); /*.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");*/ // Remove special characters
                console.log('Pyramid', originalString);

                let messageCode = originalString.substring(2, 3);
                console.log('MessageCode', messageCode);


                // Message code 6 = Countdown
                // Message code 7 = Running / Finished
                // Message code 8 = Running 2nd Phase
                // Message code 9 = Standings table

                let splitMessage = originalString.trim().split(/\s\s+/);
                if (messageCode == 7) {
                    // Running Time Mapping
                    let backNumber = originalString.substring(23, 27).trim();
                    let horse = originalString.substring(57, 87).trim();
                    let rider = originalString.substring(27, 57).trim();
                    let jumpFaults = originalString.substring(120, 130).trim();
                    jsonTime = originalString.substring(111, 119).trim();
                    let faultsDiv = document.getElementById('faults');
                    let entryDiv = document.getElementById('entry');
                    let riderDiv = document.getElementById('rider');
                    faultsDiv.innerHTML = 'Faults: <span style="color:red">' + jumpFaults + '<span>';
                    entryDiv.innerHTML = '<span style="color:red">' + backNumber + '</span> - ' + horse;
                    riderDiv.innerHTML = rider;

                    if (jsonTime.toString().indexOf(".") != -1) {
                        type = 'FINAL';
                    } else {
                        type = 'RUNN.';
                    }
                } else if (messageCode == 8) {
                    // Running Time Mapping
                    let backNumber = originalString.substring(23, 27).trim();
                    let horse = originalString.substring(57, 87).trim();
                    let rider = originalString.substring(27, 57).trim();
                    let jumpFaults = originalString.substring(120, 130).trim();
                    jsonTime = originalString.substring(141, 148).trim();
                    let faultsDiv = document.getElementById('faults');
                    let entryDiv = document.getElementById('entry');
                    let riderDiv = document.getElementById('rider');
                    faultsDiv.innerHTML = 'Faults: <span style="color:red">' + jumpFaults + '<span>';
                    entryDiv.innerHTML = '<span style="color:red">' + backNumber + '</span> - ' + horse;
                    riderDiv.innerHTML = rider;

                    if (jsonTime.toString().indexOf(".") != -1) {
                        type = 'FINAL';
                    } else {
                        type = 'RUNN.';
                    }
                } else if (messageCode == 6) {
                    // Countdown
                    type = 'CD';
                    let backNumber = originalString.substring(23, 27);
                    let horse = originalString.substring(57, 87);
                    let rider = originalString.substring(27, 57);
                    let jumpFaults = 0;
                    jsonTime = originalString.substring(111, 113).trim();

                    console.log('JSON TIME: ', jsonTime);

                    let faultsDiv = document.getElementById('faults');
                    let entryDiv = document.getElementById('entry');
                    let riderDiv = document.getElementById('rider');
                    faultsDiv.innerHTML = 'Faults: <span style="color:red">' + jumpFaults + '<span>';
                    entryDiv.innerHTML = '<span style="color:red">' + backNumber + '</span> - ' + horse;
                    riderDiv.innerHTML = rider;
                } else {
                    return;
                }

            } else if (timer == 'broder') {

                let originalString = message.toString(); /*.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");*/ // Remove special characters
                let messageCode = originalString.substring(3, 6);
                let jumpFaults = '';
                let backNumber = '';
                let rider = '-';
                let horse = '-';

                if (messageCode == 400) {
                    type = 'RUNN.';
                    jsonTime = originalString.substring(33, 40);
                    jumpFaults = originalString.substring(83, 90);
                    backNumber = originalString.substring(183, 190);
                    rider = originalString.substring(258, 270);
                    horse = originalString.substring(283, 300);
                } else if (messageCode == 300) {
                    type = 'CD';
                    jsonTime = originalString.substring(58, 61);
                    backNumber = originalString.substring(108, 115);
                    rider = originalString.substring(178, 205);
                    horse = originalString.substring(208, 230);
                } else if (messageCode == 900) {
                    type = 'FINAL';
                    jsonTime = originalString.substring(33, 40);
                    jumpFaults = originalString.substring(83, 90);
                    backNumber = originalString.substring(183, 190);
                    rider = originalString.substring(258, 270);
                    horse = originalString.substring(283, 300);
                } else if (messageCode == 200) {
                    //console.log('Code', messageCode);
                    jsonTime = 45;
                    type = 'CD';
                } else {
                    console.log('Unknown Message: ', originalString);
                    this.element.appendMessage(message, rinfo)
                }

                let faultsDiv = document.getElementById('faults');
                let entryDiv = document.getElementById('entry');
                let riderDiv = document.getElementById('rider');
                faultsDiv.innerHTML = 'Faults: <span style="color:red">' + jumpFaults + '<span>';
                entryDiv.innerHTML = '<span style="color:red">' + backNumber + '</span> - ' + horse;
                riderDiv.innerHTML = rider;
            }


            ignoreString = document.getElementById('ignoreString').value;
            //console.log("Ignore if " + ignoreString);


            this.element.appendMessage(message, rinfo)
            //console.log('Message Received: ' + message);

            //console.log('Position: ' + messageCode);

            if (message.toString().indexOf(ignoreString) > -1 && ignoreString.length > 1) {
                // console.log("Row ignored");

            } else {
                //console.log('Row not ignored');
                //time = Number.parseFloat(time) + addedTime;
                jsonTime = Number.parseFloat(jsonTime) + addedTime;
                saveTime(jsonTime, type);
            }


        });

        this.render();
    }
}