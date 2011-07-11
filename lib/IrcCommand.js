
module.exports = IrcCommandFlyweight = function() {
    this.objects = [];
};

IrcCommandFlyweight.prototype.getCommand = function(message) {
    if(!this.objects.hasOwnProperty(message.command)) {
	var name = message.command.substr(0,1).toUpperCase() + message.command.substr(1).toLowerCase();
	this.objects[message.command] = new (require("./commands/" + name + "Command.js"))();
    }

    return this.objects[message.command];
}