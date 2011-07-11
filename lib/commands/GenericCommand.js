
module.exports = GenericCommand = function() {

}

GenericCommand.prototype.execute = function(message) {
    // if the message is from a client connection, override the prefix with
    // the nick associated with this connection.
    if(message.connection.isRegistered() && message.connection.isUser()) {
	message.prefix = connection.identity.nick;
    }
}

GenericCommand.prototype.canExecute = function(message) {
    return true;
}

