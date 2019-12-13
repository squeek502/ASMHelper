var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
var ALOAD = Opcodes.ALOAD;
var GETFIELD = Opcodes.GETFIELD;
var ISTORE = Opcodes.ISTORE;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');
	ASMAPI.loadFile('utils/setup.js');
	var InsnComparator = ASMHelper.InsnComparator;

	var needle = new InsnList();
	var haystack = populateTestHaystack(new InsnList());
	var replacement = new InsnList();

	needle.add(new VarInsnNode(ALOAD, 0));
	needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, "foodLevel", "I"));
	needle.add(new VarInsnNode(ISTORE, 3));
	needle.add(new VarInsnNode(ALOAD, 0));

	var afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
	assertEquals(haystack.get(2), afterReplacement);

	populateTestHaystack(haystack);
	replacement.add(new VarInsnNode(ALOAD, 0));

	afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
	assertEquals(haystack.get(3), afterReplacement);

	afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
	assertEquals(null, afterReplacement);
}
