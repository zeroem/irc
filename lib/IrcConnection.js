

var RemoteIrcServer = require("./RemoteIrcServer.js");
var IrcMessage = require("./IrcMessage");

module.exports = IrcConnection = function(socket) {
    this.password = false;
    this.identity = false;
    this.socket = socket;
}

IrcConnection.prototype.isRegistered = function() {
    var ret = false;

    if(this.identity) {
	// we only need to check for a remote server as we should never
	// need to check if a local server has been registered
	if(this.isServer()) {
	    // verify password?
	    if(typeof this.password == "string" && this.password.length > 0) {
		// verify password here
		ret = true;
	    }
	    // if it's not a server, it's a user
	} else {

	    if(typeof this.password == string && this.password.length >0) {
		// veriy password
	    } else {
		ret = true;
	    }
	}
    }

    
}


IrcConnection.prototype.isServer = function() {
    if(this.identity !== false) {
	return RemoteIrcServer.prototype.isPrototypeOf(this.identity);
    } else {
	return false;
    }
};

IrcConnection.prototype.isUser = function() {
    return !this.isServer();
};

IrcConnection.prototype.send = function(msg) {
    if(IrcMessage.prototype.isPrototypeOf(msg)) {
	msg = msg.toMessage();
    }

    this.socket.write(msg);
}