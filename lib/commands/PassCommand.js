
var IrcRepsonse = require("../IrcResponse.js");

module.exports = PassCommand = function() {

}

require("util").inherits(PassCommand,require("./GenericCommand.js"));

PassCommand.prototype.execute = function(message) {
    var response = [];
    if(message.args.length > 0) {
	if(!message.connection.isRegistered()) {
	    message.connection.password = message.args[0];
	} else {
	    response.push(IrcResponse.Error.AlreadyRegistered.toMessage(message.connection));
	}
    } else {
	response.push(IrcResponse.Error.NeedMoreParams.toMessage(message.connection,{command: message.command}));
    }

    return response;
}