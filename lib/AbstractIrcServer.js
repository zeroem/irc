

module.exports = AbstractIrcServer = function() {
    this._users = []
};

AbstractIrcServer.prototype.execute = function(command) {
    throw new Error("Abstract method is not implemented");
};
