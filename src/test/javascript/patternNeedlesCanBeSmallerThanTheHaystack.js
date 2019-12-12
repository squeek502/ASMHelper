var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var ALOAD = Opcodes.ALOAD;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('jankytest.js');

	var haystack = new InsnList();
	haystack.add(new VarInsnNode(ALOAD, 0));
	haystack.add(new VarInsnNode(ALOAD, 1));

	var needle = new InsnList();
	needle.add(new VarInsnNode(ALOAD, 0));

	assertTrue(ASMHelper.patternMatches(needle, haystack.getFirst()));
}
