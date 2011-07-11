
var IrcResponse = require("../IrcResponse.js");

module.exports = UserCommand = function(){

};

require("util").inherits(UserCommand,require("./GenericCommand.js"));

UserCommand.prototype.execute = function(message) {
    var response = [];
    if(message.connection.isRegistered()) {
	if(message.connection.isUser()) {
	    response.push(IrcResponse.Error.AlreadyRegistered.toMessage());
	} else {
	    var user = (require("../IrcUser.js"))();
	    user.loadFromMessage(message);
	    connection.identity.addUser();
	}
    } else {
	
    }

    return response;
}
