/**
 * The IrcNetworking Module acts as the controller for the IRC Application.
 * It's primary role is managine the various TCP listeners and connections,
 * as well as parsing out individual commands from the socket data, retrieving
 * the approrpriate Command objects and executing it on the IrcNetwork model
 */

var net = require("net");
var util = require("util");
var IrcMessage = require("./IrcMessage.js");
var IrcCommand = require("./IrcCommand.js");

module.exports = IrcNetworking = function(network) {
    /**
     * List of connection listeners, one or more of TCP or TLS
     * socket listeners
     */
    this._listeners = [];

    /**
     * All socket connections to the above servers
     */
    this._sockets = [];

    this._network = network;

    this.commandFlyweight = new IrcCommand();
};



IrcNetworking.prototype.addListener = function(server) {

    var self = this;

    server.server_id = this._listeners.push(server)-1;

    server.on("connection",function(socket) {
	socket.socket_id = (self._sockets.push(socket) - 1);
	socket.connection = self._network.addConnection(new IrcConnection(socket));


	socket.setEncoding("utf8");

	// if the connection has yet to be registered, dispose of it.
	// this is not actually useful for killing dummy connections as it
	// requires inactivity on the socket.  maybe that's ok?  maybe kill it
	// after x failed commands?  maybe use a normal setTimeout call?
	// this would, however, be useful for PING/PONG
	socket.setTimeout(1000*10,function() {
	    console.log(socket.connection);
	    if(!this.connection.isRegistered()) {
		this.end("derp derp!");
		this.destroy();
		delete self._sockets[socket.socket_id];
	    }
	});

	
	socket.on("data",function(data) {
	    var startIdx = 0;
	    var idx=-1;

	    while((idx = data.indexOf(IrcMessage._terminator,startIdx)) != -1) {
		try {
		    var msg = IrcMessage.makeMessage(socket.connection,data.substring(startIdx,idx+2));
		    console.log(msg.command);
		    startIdx = idx+2;
		    self.processMessage(msg);;
		} catch( err ) {
		    throw err;
		}
	    }
	});

	socket.on("end",function() {
	    // derp?
	});
    });
};

/**
 * This needs to be moved out, not sure where though...
 */
IrcNetworking.prototype.processMessage = function(message) {
    // abstract the "message delivery" logic.  eg messages to &chans
    // should only be processed by the local server, messages to a 
    // specific user should only be sent to the client or server it can bec
    // contacted through
    var command = this.commandFlyweight.getCommand(message);

    if(command.canExecute(message)) {
	var response = command.execute(message);
	if(response) {
	    
	}
    }
};