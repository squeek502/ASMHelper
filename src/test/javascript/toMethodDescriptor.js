var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');

	assertEquals("(Linternal/class/name;Lclass/descriptor;)Lreturn/class/name;", ASMHelper.toMethodDescriptor("return.class.name", "internal/class/name", "Lclass/descriptor;"));
	assertEquals("(FZ)V", ASMHelper.toMethodDescriptor("V", "F", "Z"));
}
