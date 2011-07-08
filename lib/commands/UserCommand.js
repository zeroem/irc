
var IrcRepsonse = require("../IrcResponse.js");

module.exports = UserCommand = {
    execute: function(network,connection,message) {
	if(connection.isRegistered()) {
	    if(connection.isUser()) {
		connection.send(IrcResponse.Error.AlreadyRegistered.toMessage());
	    } else {
		
	    }
	} else {
	    
	}
    }
}

function makeUser(message) {
    if(message.args.length != 4) {
	return IrcResponse.Error.NeedMoreParams.toMessage({command:message.command});
    } 

    
}