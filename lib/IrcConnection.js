

var RemoteIrcServer = require("./RemoateIrcServer.js");

module.exports = IrcConnection = function(connection_id) {
    this.password = false;
    this.record = false;
    this.connection_id = connection_id;
}

IrcConnection.prototype.isRegistered = function() {
    var ret = false;

    if(this.record) {
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
    if(this.record !== false) {
	return RemoteIrcServer.prototype.isPrototypeOf(this.record);
    } else {
	return false;
    }
}

IrcConnection.prototype.isUser = function() {
    return !this.isServer();
}