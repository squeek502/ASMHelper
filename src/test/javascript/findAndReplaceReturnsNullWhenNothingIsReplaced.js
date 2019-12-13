var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
var GETFIELD = Opcodes.GETFIELD;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');
	ASMAPI.loadFile('utils/setup.js');
	var InsnComparator = ASMHelper.InsnComparator;

	var needle = new InsnList();
	var haystack = populateTestHaystack(new InsnList());
	var replacement = new InsnList();

	needle.add(new FieldInsnNode(GETFIELD, "bogusClassInternalName", "bogusMethodName", "bogus"));

	var afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
	assertEquals(null, afterReplacement);
}
