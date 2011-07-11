

var IrcConnection = require("./IrcConnection.js");
var IrcMessage = require("./IrcMessage.js");

var IrcChannel = require("./IrcChannel.js");
var IrcUser = require("./IrcUser.js");

module.exports = IrcNetwork = function() {
    this._connections = [];

    /** All Servers in the network */
    this._servers = [];

    /** All distributed channels on the network (eg _not_ &chan) */
    this._channels = [];

    /** List of all users on the network */
    this._users = [];
};

IrcNetwork.prototype.addConnection = function(conn) {
    conn.network = this;
    this._connections.push(conn);
    return conn;
}

IrcNetwork.prototype.removeConnection = function(id) {
    if(this._connections.hasOwnProperty(id)) {
	var conn = this._connections[id];
	delete this._connections[id];
	return conn;
    }

    return false;
}

IrcNetwork.prototype.getConnection = function(id) {
    return this._connections[id];
}


IrcNetwork.prototype.isNickTaken = function(nick) {
    return this._users.hasOwnProperty(nick);
};

IrcNetwork.prototype.getUserByNick = function(nick) {
    if(this._users.hasOwnProperty(nick)) {
	return this._users[nick];
    }

    return false;
};

IrcNetwork.prototype.addUser = function(user) {
    if(!this.isNickTaken(user.nick)) {
	this._users[user.nick] = user;
	return user;
    }

    return false;
};

IrcNetwork.prototype.removeUser = function(user) {
    if(this.isNickTaken(user.nick)) {
	delete this._users[user.nick];
	return user;
    }

    return false;
}

IrcNetwork.prototype.changeNick = function(user,nick) {
    if(!this.isNickTaken(nick)) {
	this.removeUser(user);
	if(user !== false) {
	    user.nick = nick;
	    return this.addUser(user);
	}
    }

    return false;
}

IrcNetwork.prototype.channelExists = function(name) {
    return this._channels.hasOwnProperty(name);
};

IrcNetwork.prototype.addChannel = function(name) {
    if(!this.channelExists(name)) {
	var chan = new IrcChannel(name);
	return this._channels[name] = chan;
    }

    return false;
};

IrcNetwork.prototype.removeChannel = function(name) {
    if(this.channelExists(name)) {
	var chan = this._channel[name];
	delete this.channel[name];
	return chan;
    }

    return false;
};

IrcNetwork.prototype.getChannel = function(chan) {
    if(this.channelExists(chan)) {
	return this._channels[chan];
    }

    return false;
}

