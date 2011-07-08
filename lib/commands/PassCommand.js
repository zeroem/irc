
var IrcRepsonse = require("../IrcResponse.js");

module.exports = PassCommand = {
    execute: function(network,connection,message) {
	if(message.args.length > 0) {
	    if(!connection.isRegistered()) {
		connection.password = message.args[0];
	    } else {
		connection.send(IrcResponse.Error.AlreadyRegistered.toMessage());
	    }
	} else {
	    connection.send(IrcResponse.Error.NeedMoreParams.toMessage({command: message.command}));
	}
    }
}