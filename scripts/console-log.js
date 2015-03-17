/* console-log.js is a global wrapper for console.log
 * in browsers without a console, it creates an empty log() function for graceful degradation
 * console.Log() wraps console.log (in supported browsers) and adds some extra functionality:
 * console.silentMode suppresses all console.Log messages throughout the app, or in particular sections of code
 * console.debugLevel sets which console.Log messages to display, based on their severity / importance
 * usage: console.Log('message',debugLevel); // message is the string to log, debugLevel is the severity of the log message
 */
if (typeof console === 'undefined'){
	// create an empty console object in browsers that do not support it to avoid unhandled errors
	var console = {
		log: function(){
			return;
		}
	}
}
/* errorLogging writes all console._log() messages to localStorage for client debugging */
console.errorLogging = false;
console.errorLog = function(state){
	if (typeof state === 'undefined' || state === true || state === 1 || state === 'on'){
		// passing nothing, true, 1 or 'on' turns on errorLogging
		this.errorLogging = true;
		this.silent(false);
		this.setDebugLevel(3);
	} else if (state === false || state === 0 || state === 'off') {
		// passing false, 0 or 'off' turns off errorLogging
		this.errorLogging = false;
		localStorage.setItem('debuglog','');
		this.silent(true);
	}
};
/* silentMode suppresses all console.Log() messages, regardless of debugLevel
 * the global app should use silentMode = false by default
 * silentMode can be deactivated app-wide or on a specific module or block of code for testing / debugging
 */
console.silentMode = false;
console.silent = function(state){
	if (typeof state === 'undefined' || state === true || state === 1 || state === 'on'){
		// passing nothing, true, 1 or 'on' turns on silentMode
		this.silentMode = true;
	} else if (state === false || state === 0 || state === 'off') {
		// passing false, 0 or 'off' turns off silentMode
		this.silentMode = false;
	}
}
/* debugLevel determines which console.Log() messages are logged; it sets overall verbosity of the console
 * level 0 = debug (used for immediate debugging of variables and functions); console.Log('message',0) will always log regardless of debugLevel
 * level 1 = instantiation of functions, modules, objects; calls to major parts of the code
 * level 2 = triggered events, AJAX calls
 * level 3 = all other function calls
 * level null = 0: console.Log('message') is the same as: console.Log('message',0);
 */
console.debugLevel = 3;
console.setDebugLevel = function(level){
	if (!level){
		// passing 0, false or nothing sets debugLevel = 0
		this.debugLevel = 0;
	} else {
		// debugLevel can't be > 3
		this.debugLevel = level > 3 ? 3 : level;
	}
}
console._log = function(message,level){
	if (this.silentMode === true){
		return;
	}

	// manually throw an error to get the linenumber and filename of the calling function
	var err = function(){
		try {
			throw new Error('');
		} catch(error) {
			return error;
		}
	}();
	var location = '';

	// Awesome Internet Explorer 8-9 doesn't have Error.stack implemented
	if (typeof err.stack !== 'undefined'){
		var caller = '';
		// Guess what? Firefox and Opera's error stack is different from Chrome's!
		if (navigator.userAgent.match(/[Firefox|Opera]/gi)){ // browser sniffing isn't ideal, but I see no way around this
			caller = err.stack.split("\n")[2];
		} else {
			caller = err.stack.split("\n")[3];
		}
		var filename = caller.substring(caller.lastIndexOf('\/') + 1, caller.indexOf('.js:') + 3);
		var linenumber = parseInt(caller.substring(caller.indexOf('.js:') + 4),10);

		location = filename + ':' + linenumber.toString() + ' ';
	} else { // handle IE 8-9, Safari by getting clicked element id / class
		if(window.event.srcElement) {
			var targetId = 'id=' + window.event.srcElement.id;
			if (typeof targetId === 'undefined' || targetId === null || targetId.length === 0){
				targetId = 'class=' + window.event.srcElement.className;
			}
			if (typeof targetId === 'undefined' || targetId === 'class='){
				targetId = 'event';
			}
			location = targetId + ':' + window.event.type + ' ';
		}
	}

	if (this.errorLogging){
		var debug = {};
		var debuglog = localStorage.getItem('debuglog');
		if (debuglog !== null && debuglog.length > 0){
			debug = JSON.parse(debuglog);
			debug.messages = debug.messages + '|' + location + message;
		} else {
			debug.starttime = new Date().toISOString();
			debug.messages = location + message;
		}
		localStorage.setItem('debuglog', JSON.stringify(debug));
	}
	if (level){
		if (level <= this.debugLevel){
			console.log(location, message);
		}
	} else {
		console.log(location, message);
	}
}
