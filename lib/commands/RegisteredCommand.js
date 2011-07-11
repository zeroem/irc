

module.exports = RegisteredCommand = function() {

}

require("util").inherits(RegisteredCommand,require("./GenericCommand.js"));

RegisteredCommand.prototype.canExecute: function(message) {
    return message.connection.isRegistered();
}
