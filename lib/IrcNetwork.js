
var LocalIrcServer = require("./LocalIrcServer.js");
var IrcCommand = require("./IrcCommand.js");
var IrcConnection = require("./IrcConnection.js");
var IrcMessage = require("./IrcMessage.js");

module.exports = IrcNetwork = function() {
    /** the networking interface we're listening for data on */
    this._networking = [];

    /** 
     * List of registration data (user/server)
     * Not sure if this should be maintained here or on the LocalServer Instance
     */

    this._connections = [];

    /** All Servers in the network */
    this._servers = [new LocalIrcServer(this)];

    /** All distributed channels on the network (eg _not_ &chan) */
    this._channels = [];

    /** List of all users on the network */
    this._users = [];
};

IrcNetwork.prototype.addServer = function(server) {

    var self = this;

    server.server_id = self._networking.push(server);

    server.on("connection",function(socket) {
	var connection = new IrcConnection(socket);
	socket.connection_id = (self._connections.push(connection) - 1);

	socket.setEncoding("utf8");

	// if the connection has yet to be registered, dispose of it.
	// this is not actually useful for killing dummy connections as it
	// requires inactivity on the socket.  maybe that's ok?  maybe kill it
	// after x failed commands?  maybe use a normal setTimeout call?
	// this would, however, be useful for PING/PONG
	socket.setTimeout(1000*20,function() {
	    if(!self._connections[this.connection_id].isRegistered()) {
		this.end("derp derp!");
		this.destroy();
		delete self._connections[socket.connection_id];
	    }
	});

	
	socket.on("data",function(data) {
	    var startIdx = 0;
	    var idx=-1;

	    while((idx = data.indexOf(IrcMessage._terminator,startIdx)) != -1) {
		try {
		    var msg = IrcMessage.makeMessage(data.substring(startIdx,idx+2));
		    startIdx = idx+2;
		    self.processMessage(self._connections[this.connection_id],msg);;
		} catch( err ) {
		    console.log(err);
		    console.log(data.substring(startIdx,idx+2));
		}
	    }
	});

	socket.on("end",function() {
	    // derp?
	});

    });
};

IrcNetwork.prototype.getLocalServer = function() {
    if(this._servers.length > 0) {
	return this._servers[0];
    }

    throw new Error("This object has been corrupted");
};

IrcNetwork.prototype.processMessage = function(connection,message) {
    // abstract the "message delivery" logic.  eg messages to &chans
    // should only be processed by the local server, messages to a 
    // specific user should only be sent to the client or server it can bec
    // contacted through
    var command = IrcCommand.getCommand(message);
    command.execute(this,connection,message);
};

IrcNetwork.prototype.processConnection = function(socket) {
    // is there anything we should do?
};