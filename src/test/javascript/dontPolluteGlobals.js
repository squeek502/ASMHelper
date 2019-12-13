var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");

function initializeCoreMod() {
	ASMAPI.loadFile('utils/jankytest.js');

	// 'this' is the global object in the current context
	var before = Object.keys(this);
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	var after = Object.keys(this);

	// should only add an ASMHelper global
	assertEquals(1, after.length - before.length);
}

