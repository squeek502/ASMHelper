var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('jankytest.js');

	var haystack = new InsnList();
	haystack.add(new VarInsnNode(Opcodes.ALOAD, 0));

	var needle = new InsnList();
	needle.add(new VarInsnNode(Opcodes.ALOAD, 0));
	needle.add(new VarInsnNode(Opcodes.ALOAD, 1));

	assertFalse(ASMHelper.patternMatches(needle, haystack.getFirst()));
}
