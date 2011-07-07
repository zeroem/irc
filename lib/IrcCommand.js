
module.exports = IrcCommand = {
    
};

IrcCommand.getCommand = function(message) {
    var name = message.command.substr(0,1).toUpperCase() + message.command.substr(1).toLowerCase();
    var command = require("./commands/" + name + "Command.js");
    return command;
}