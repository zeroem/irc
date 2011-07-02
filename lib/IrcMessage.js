
/**
 * Utility class for dealing with IRC Messages.
 * Can validate message format, parse a valid string into a message object
 * and be used to construct new messages/responses
 */


module.exports = IrcMessage = function(str,command,args) {
    // Initialize an empty object
    this.sender = "";
    this.command = "";
    this.args = [];

    // if we got an argument(s), assume we're parsing out a message
    if(arguments.length == 1) {
	if(this.isValidMessage(str)) {
	    this._original = str;
	    var parts = this.parseMessage(str);
	    this.sender = parts[0];
	    this.command = parts[1];
	    this._args_str = parts[2].trim();
	    this.args = this.parseArguments(this._args_str);
	} else {
	    throw new Error("Invalid Message Format");
	}
    // If we have more than one argument, assume we're constructing a message
    } else if( arguments.length > 1 ) {
	if(str) {
	    var clean = str.trim();
	    if(clean.length > 0) {
		this.sender = clean;
	    }
	}

	this.command = command;
	this.args = args;
    }
};

/**
 * Convenience function for chaining the creation of the
 * IrcMessage object from a string off of the `require' call
 */
IrcMessage.parseMessage(str) {
    return new IrcMessage(str);
}


/**
 * Convert a parsed or constructed message into a string suitable for
 * sending to IRC clients/servers
 *
 * @return string
 */
IrcMessage.prototype.toMessage = function() {
    var str = "";
    if(this.sender.length > 0) {
	str += ":" + this.sender + " ";
    }

    str += this.command.toLocaleUpperCase();

    if(this.args.length > 0) {
	for(var idx in this.args) {
	    str += " ";
	    if(this.args[idx].indexOf(this._delimiter) != -1) {
		str += ":";
	    }

	    str += this.args[idx]
	}
    }

    str += "\r\n";

    return str;
}

IrcMessage.prototype.parseMessage = function(str) {
    var parts = this._parseMessageRegex.exec(str);

    // remove unwanted elements from the regex match
    parts.shift();
    parts.shift();

    delete parts["input"];
    delete parts["index"];
    return parts;
}

/**
 * Given a properly formatted string of arguments from an IRC Message,
 * parse it into an array of individual arguments
 * 
 * @param string str argument string to parse
 * @return Array
 */
IrcMessage.prototype.parseArguments = function(str) {
    var args = [];

    while((match = this._parseArgumentRegex.exec(str)) != null) {
	if(match[1] != undefined) {
	    args.push(match[1]);
	} else {
	    args.push(match[2]);
	}
    }
    
    return args;
}

/**
 * Uses Regular Expressions to determine whether or not
 * the given string is in the proper format for an IRC message
 *
 * @param string str message to test
 * @return boolean
 */
IrcMessage.prototype.isValidMessage = function(str) {
    if(this._validMessageRegex.test(str)) {
	return true;
    }

    return false;
}


IrcMessage.prototype._validMessageRegex = new RegExp(
    "^(:([^ :\0\r\n]+) )?([A-Z]+)( [^ :\0\r\n]+)*( :[^\0\r\n]*)?\r\n$"
);

IrcMessage.prototype._parseMessageRegex = new RegExp(
    "^(:([^ :\0\r\n]+) )?([A-Z]+)(.*)\r\n$"
);

IrcMessage.prototype._parseArgumentRegex = new RegExp(
    "([^:\0\r\n][^ \0\r\n]*)|:([^\0\r\n]*)","g"
);

IrcMessage.prototype._delimiter = " ";
