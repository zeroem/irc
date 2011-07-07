
var LocalIrcServer = require("./LocalIrcServer.js");
var IrcCommand = require("./IrcCommand.js");

module.exports = IrcNetwork = function(networking) {
    /** the networking interface we're listening for data on */
    this._networking = networking;

    var not_this = this;

    this.networking.on("message",function() {
	not_this.processMessage.apply(not_this,arguments);
    });

    this.networking.on("connection",function() {
	not_this.processConnection.apply(not_this,arguments);
    });


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

IrcNetwork.prototype.getLocalServer = function() {
    if(this._servers.length > 0) {
	return this._servers[0];
    }

    throw new Error("This object has been corrupted");
};

IrcNetwork.prototype.processMessage = function(connection_id,message) {
    // abstract the "message delivery" logic.  eg messages to &chans
    // should only be processed by the local server, messages to a 
    // specific user should only be sent to the client or server it can bec
    // contacted through
    var command = IrcCommand.getCommand(message);
    command.execute(this,connection_id,message);
};

IrcNetwork.prototype.processConnection = function(socket) {
    // is there anything we should do?
};