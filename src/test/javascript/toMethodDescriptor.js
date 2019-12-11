var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var opcodes = Java.type('org.objectweb.asm.Opcodes');

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('jankytest.js');

	assertEquals("(Linternal/class/name;Lclass/descriptor;)Lclass/name;", ASMHelper.toMethodDescriptor("class.name", "internal/class/name", "Lclass/descriptor;"));
	assertEquals("(FZ)V", ASMHelper.toMethodDescriptor("V", "F", "Z"));
}
