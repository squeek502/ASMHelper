var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
var ALOAD = Opcodes.ALOAD;
var GETFIELD = Opcodes.GETFIELD;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');
	ASMAPI.loadFile('utils/setup.js');
	var InsnComparator = ASMHelper.InsnComparator;

	var needle = new InsnList();
	var haystack = populateTestHaystack(new InsnList());
	var replacement = new InsnList();

	needle.add(new VarInsnNode(ALOAD, InsnComparator.INT_WILDCARD));
	needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, InsnComparator.WILDCARD, InsnComparator.WILDCARD));

	var numReplaced = ASMHelper.findAndReplaceAll(haystack, needle, replacement);
	assertEquals(6, numReplaced);

	numReplaced = ASMHelper.findAndReplaceAll(haystack, needle, replacement);
	assertEquals(0, numReplaced);
}