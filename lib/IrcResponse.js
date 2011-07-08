var IrcMessage = require("./IrcMessage.js");

function IrcResponse(code,token,message) {
    this.code = code;
    this.token = token;
    this.message = message;

    Object.freeze(this);
}

IrcResponse.prototype.toMessage = function(args) {
    var msg = this.message;
    for(idx in args) {
	msg.replace("<"+idx+">", args[idx]);
    }

    var message = new IrcMessage();
    message.command = this.code;
    message.args.push(msg);

    return message;
}

module.exports = {
    Error: {
	NeedMoreParams: new IrcResponse(461,"ERR_NEEDMOREPARAMS","<command> :Not enough parameters"),
	AlreadyRegistered: new IrcResponse(462,"ERR_ALREADYREGISTRED",":You may not reregister")
    }
}