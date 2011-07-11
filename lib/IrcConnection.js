

var RemoteIrcServer = require("./RemoteIrcServer.js");
var IrcMessage = require("./IrcMessage");

module.exports = IrcConnection = function(socket,network) {
    this.password = false;
    this.identity = false;
    this.socket = socket;
    this.network = network;
};

IrcConnection.prototype.hasIdentity = function() {
    return this.identity !== false;
}

IrcConnection.prototype.isRegistered = function() {
    var ret = false;

    if(this.identity) {
	ret = this.identity.isRegistered();
    }

    return ret;
}

IrcConnection.prototype.setIdentity = function(obj) {
    this.identity = obj;
}


IrcConnection.prototype.isServer = function() {
    if(this.hasIdentity()) {
	return RemoteIrcServer.prototype.isPrototypeOf(this.identity);
    } else {
	return false;
    }
};

IrcConnection.prototype.isUser = function() {
    return !this.isServer();
};
