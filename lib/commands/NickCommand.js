
module.exports = NickCommand = function(){

}

require("util").inherits(NickCommand,require("./GenericCommand.js"));

NickCommand.prototype.execute = function(message) {
    var response = [];
    if(message.args.length>0) {
	var nick = message.args[0];
	
	if(message.connection.isRegistered()) {
	    // check for nick collision
	    if(message.connection.network.isNickTaken(nick)) {
		if(message.connection.isUser()) {
		    
		}
	    } else {
		
	    }
	} else {
	    if(message.connection.network.isNickTaken(nick)) {
		response.push(IrcResponse.Error.NickCollision.toMessage(message.connection,{command: message.command}));
	    } else {
		if(!message.connection.hasIdentity()) {
		    var user = new (require("../IrcUser.js"))();
		    user.nick = nick;
		    message.connection.setIdentity(user);
		    message.connection.network.addUser(user);
		} else {
		    message.connection.network.changeNick(connection
		}
		message.connection.identity.nick = nick;
		console.log(message.connection.network);
	    }
	}
    } else {
	response.push(IrcResponse.Error.NoNicknameGiven.toMessage(message.connection,{command: message.command}));
    }

    return response;
}