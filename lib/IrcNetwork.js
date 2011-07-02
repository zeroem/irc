
var LocalIrcServer = require("./LocalIrcServer.js");

module.exports = IrcNetwork = function() {
    this._servers = [new LocalIrcServer(this)];
    this._channels = [];
    this._users = [];
};

IrcNetwork.prototype.getLocalServer = function() {
    if(this._servers.length > 0) {
	return this._servers[0];
    }

    throw new Error("This object has been corrupted");
};

IrcNetwork.prototype.processCommand = function(str) {

};

