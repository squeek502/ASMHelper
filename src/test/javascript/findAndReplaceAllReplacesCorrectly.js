var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
var ALOAD = Opcodes.ALOAD;
var GETFIELD = Opcodes.GETFIELD;
var RETURN = Opcodes.RETURN;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');
	ASMAPI.loadFile('utils/setup.js');
	var InsnComparator = ASMHelper.InsnComparator;

	var needle = new InsnList();
	var haystack = new InsnList();
	var replacement = new InsnList();
	var result = new InsnList();

	needle.add(new VarInsnNode(ALOAD, InsnComparator.INT_WILDCARD));
	needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, InsnComparator.WILDCARD, InsnComparator.WILDCARD));

	replacement.add(new VarInsnNode(ALOAD, 0));

	haystack.add(new VarInsnNode(ALOAD, 0));
	haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
	haystack.add(new VarInsnNode(ALOAD, 1));
	haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
	haystack.add(new VarInsnNode(ALOAD, 2));
	haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
	haystack.add(new InsnNode(RETURN));

	result.add(new VarInsnNode(ALOAD, 0));
	result.add(new VarInsnNode(ALOAD, 0));
	result.add(new VarInsnNode(ALOAD, 0));
	result.add(new InsnNode(RETURN));

	ASMHelper.findAndReplaceAll(haystack, needle, replacement);
	assertEquals(4, haystack.size());
	assertTrue(ASMHelper.patternMatches(result, haystack.getFirst()));
}
