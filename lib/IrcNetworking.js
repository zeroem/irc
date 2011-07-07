
var net = require("net");
var util = require("util");
var IrcMessage = require("./IrcMessage.js");
var EventEmitter = require("events").EventEmitter;

module.exports = IrcNetworking = function(options) {
    IrcNetworking.super_.apply(this,arguments);
    /**
     * List of connection listeners, one or more of TCP or TLS
     * socket listeners
     */
    this._listeners = [];

    /**
     * All socket connections to the above servers
     */
    this._connections = [];

    this.settings = {
	/**
	 * should we allow tls connections
	 * @var boolean
	 */
	allowTls: false,
	/**
	 * should we force people to use tls
	 * @var boolean
	 */
	forceTls: false,
	encoding: "utf8",
	tls: {
	    requestCert: false,
	    rejectUnauthorized: false,
	    listen: {
		port: 6697,
		host: null
	    }
	},

	plain: {
	    allowHalfOpen: false,
	    listen: {
		port: 6667,
		host: null
	    }
	},
    };

    if(arguments.length < 1 || !options) {
	options = {};
    }

    // recursively merge the passed options into the default settings
    (function(src,targ) {
	for(name in src) {
	    if(src.hasOwnProperty(name)) {
		if(typeof(src[name]) == "object" && targ.hasOwnProperty(name)) {
		    arguments.callee.bind(null,src[name],targ[name]);
		} else {
		    targ[name] = src[name];
		}
	    }
	}
    })(options,this.settings);

    // NOTE: Consider allowing an iterable collection of "plain" or "TLS" server details in the settings

    // register tls listener if allowed or forced
    if(this.settings.allowTls || this.settings.forceTls) {
	console.log("tls");
	var listener = require("tls").createServer(this.settings.tls,IrcNetworking.handleConnection);

	// NOTE: this is so we can reference the IrcNetworkServer instance from the "on connection" callback function
	listener._irc_network = this;
	this._listeners.push(listener);
    }

    // register plain text listener only if we're not forcing tls
    if(!this.settings.forceTls) {
	console.log("plain");
	var listener = require("net").createServer(this.settings.plain,IrcNetworking.handleConnection);

	// NOTE: this is so we can reference the IrcNetworkServer instance from the "on connection" callback function
	listener._irc_network = this;
	this._listeners.push(listener);
    }
};


util.inherits(IrcNetworking,EventEmitter);


/**
 * Begin listening on all pertinent connections
 */
IrcNetworking.prototype.start = function() {
    var idx = 0;

    // forcing tls will override the allow tls setting
    if(this.settings.allowTls || this.settings.forceTls) {
	this._listeners[idx].listen(
	    this.settings.tls.listen.port,
	    this.settings.tls.listen.host
	);
	idx++;
    }

    // the only reason not to start a standard TCP server is if we're disallowing it
    if(!this.settings.forceTls) {
	this._listeners[idx].listen(
	    this.settings.plain.listen.port,
	    this.settings.plain.listen.host
	);
    }
}

IrcNetworking.prototype.getConnection = function(id) {
    if(this._connections.hasOwnProperty(id)) {
	return this._connections[id];
    } else {
	// throw an exception instead?
	return false;
    }
}

// NOTE: Within this function, 'this' refers to the tcp server the connection is being made to.
IrcNetworking.handleConnection = function(socket) {
    socket.connection_id = this._irc_network._connections.push(socket);
    socket.setEncoding(this._irc_network.settings.encoding);
    socket.on("data",IrcNetworking.handleData);
    socket.on("end",IrcNetworking.handleEnd);

    this._irc_network.emit("connection",socket);
    
};

// NOTE: Withing this function, 'this' refers to the socket that the data was recieived from
IrcNetworking.handleData = function(data) {
    var startIdx = 0;
    var idx=-1;

    // break the messages down, delimited by the irc message terminator
    // and emit an event for each line
    while((idx = data.indexOf(IrcMessage._terminator,startIdx)) != -1) {
	try {
	    var msg = IrcMessage.makeMessage(data.substring(startIdx,idx+2));
	    startIdx = idx+2;
	    this.server._irc_network.emit("message",this.connection_id,msg);
	} catch( err ) {
	    this.server._irc_network.emit("error",data.substring(startIdx,idx+2));
	}
    }

}

// NOTE: Withing this function, 'this' refers to the socket that is ending
IrcNetworking.handleEnd = function() {
    // delete will maintain array indexes, which we are using as
    // unique ids for each connection.
    delete this.server._irc_network._connections[socket.connection_id];

    // Allow anyone listening in to do whatever is needed to react to the colsed connection
    this.server._irc_network.emit("disconnect", socket.connection_id);
};
