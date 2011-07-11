
module.exports = ServerCommand = function() {

}

require("util").inherits(RegisteredCommand,require("./GenericCommand.js"));

ServerCommand.prototype.canExecute: function(message) {
    return message.connection.isServer();
}
