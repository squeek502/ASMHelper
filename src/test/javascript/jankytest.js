var JankyTest = {
	getCaller: function() {
		// get the line number of the caller rather than the Error creation
		var stack = (new Error).stack;
		var caller_line = stack.split("\n")[3];
		return "\n" + caller_line;
	},
	fail: function(msg) {
		throw new Error('fail: ' + msg + JankyTest.getCaller());
	},
	assert: function(value, msg) {
		if (value) return;
		throw new Error('assertion failed: ' + msg);
	},
	assertEquals: function(expected, actual) {
		if (expected == actual) return;
		throw new Error('assertEquals failed: "' + expected + '" != "' + actual + '"');
	},
	assertStrictEquals: function(expected, actual) {
		if (expected === actual) return;
		throw new Error('assertStrictEquals failed: "' + expected + '" !== "' + actual + '"');
	},
	assertTrue: function(actual) {
		if (actual) return;
		throw new Error('assertTrue failed: "' + actual);
	},
	assertFalse: function(actual) {
		if (!actual) return;
		throw new Error('assertFalse failed: "' + actual);
	},
};

// just expose to global for convenience
var fail = JankyTest.fail;
var assert = JankyTest.assert;
var assertEquals = JankyTest.assertEquals;
var assertStrictEquals = JankyTest.assertStrictEquals;
var assertTrue = JankyTest.assertTrue;
var assertFalse = JankyTest.assertFalse;