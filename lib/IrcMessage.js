
/**
 * Utility class for dealing with IRC Messages.
 * Can validate message format, parse a valid string into a message object
 * and be used to construct new messages/responses
 */


module.exports = IrcMessage = function(sender,command,args) {
    // Initialize an empty object
    this.sender = sender;
    this.command = command;
    this.args = args;
};

/**
 * Builder method for parsing plain text messages into an IrcMessage Object
 */
IrcMessage.makeMessage = function(str) {
    // if we got an argument(s), assume we're parsing out a message
    if(IrcMessage.isValidMessage(str)) {
	var parts = IrcMessage.parseMessage(str);
	return new IrcMessage(
	    parts[0],
	    parts[1],
	    IrcMessage.parseArguments(parts[2].trim())
	);
    } else {
	throw new Error("Invalid Message Format");
    }
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
	    if(this.args[idx].indexOf(IrcMessage._delimiter) != -1) {
		str += ":";
	    }

	    str += this.args[idx];
	}
    }

    str += "\r\n";

    return str;
}

IrcMessage.parseMessage = function(str) {
    var parts = this._parseMessageRegex.exec(str);

    // remove unwanted elements from the regex match
    parts.shift();
    parts.shift();

    delete parts["input"];
    delete parts["index"];

    // Normalize the data
    for( var idx in parts ) {
	if(!parts[idx]) {
	    parts[idx] = "";
	}
    }

    return parts;
}

/**
 * Given a properly formatted string of arguments from an IRC Message,
 * parse it into an array of individual arguments
 * 
 * @param string str argument string to parse
 * @return Array
 */
IrcMessage.parseArguments = function(str) {
    var args = [];

    var remainder = str;

    while(remainder.length > 0) {
	if(remainder.charAt(0) == IrcMessage._longArgMarker) {
	    args.push(remainder.substr(1));
	    remainder = "";
	} else {
	    var idx = remainder.indexOf(IrcMessage._delimiter);

	    if(idx > -1) {
		args.push(remainder.substring(0,idx));
		remainder = remainder.substr(idx+1);
	    } else {
		args.push(remainder);
		remainder = "";
	    }
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
IrcMessage.isValidMessage = function(str) {
    if(this._validMessageRegex.test(str)) {
	return true;
    }

    return false;
}


IrcMessage._validMessageRegex = new RegExp(
    "^(:([^ :\0\r\n]+) )?([A-Z]+)( [^ :\0\r\n]+)*( :[^\0\r\n]*)?\r\n$"
);

IrcMessage._parseMessageRegex = new RegExp(
    "^(:([^ :\0\r\n]+) )?([A-Z]+)(.*)\r\n$"
);

IrcMessage._delimiter = " ";
IrcMessage._longArgMarker = ":";
IrcMessage._terminator = "\r\n";