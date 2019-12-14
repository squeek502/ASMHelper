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
		throw new Error('assertion failed: ' + msg  + JankyTest.getCaller());
	},
	assertEquals: function(expected, actual) {
		if (expected == actual) return;
		throw new Error('assertEquals failed: "' + expected + '" != "' + actual + '"'  + JankyTest.getCaller());
	},
	assertStrictEquals: function(expected, actual) {
		if (expected === actual) return;
		throw new Error('assertStrictEquals failed: "' + expected + '" !== "' + actual + '"'  + JankyTest.getCaller());
	},
	assertTrue: function(actual) {
		if (actual) return;
		throw new Error('assertTrue failed: "' + actual  + JankyTest.getCaller());
	},
	assertFalse: function(actual) {
		if (!actual) return;
		throw new Error('assertFalse failed: "' + actual  + JankyTest.getCaller());
	},
};

// just expose to global for convenience
var fail = JankyTest.fail;
var assert = JankyTest.assert;
var assertEquals = JankyTest.assertEquals;
var assertStrictEquals = JankyTest.assertStrictEquals;
var assertTrue = JankyTest.assertTrue;
var assertFalse = JankyTest.assertFalse;