var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var LineNumberNode = Java.type("org.objectweb.asm.tree.LineNumberNode");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('jankytest.js');

	var haystack = new InsnList();
	haystack.add(new LabelNode());
	haystack.add(new VarInsnNode(Opcodes.ALOAD, 0));
	haystack.add(new LineNumberNode(10, new LabelNode()));

	var needle = new InsnList();
	needle.add(new LineNumberNode(1, new LabelNode()));
	needle.add(new VarInsnNode(Opcodes.ALOAD, 0));
	needle.add(new LabelNode());
	needle.add(new LineNumberNode(2, new LabelNode()));
	needle.add(new LabelNode());

	assertTrue(ASMHelper.patternMatches(needle, haystack.getFirst()));
}
