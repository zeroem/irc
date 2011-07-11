

module.exports = IrcUser = function() {
    this.nick = false;
    this.password = false;
    this.username = false;
    this.hostname = false;
    this.servername = false;
    this.realname = false;
};


IrcUser.prototype.isRegistered = function() {
    return this.nick !== false && this.username !== false && this.hostname !== false && this.servername !== false && this.realname !== false;
};

