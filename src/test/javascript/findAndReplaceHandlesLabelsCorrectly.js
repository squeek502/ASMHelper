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
	var haystack = new InsnList();
	var replacement = new InsnList();

	needle.add(new VarInsnNode(ALOAD, InsnComparator.INT_WILDCARD));
	needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, InsnComparator.WILDCARD, InsnComparator.WILDCARD));

	haystack.add(new LabelNode());
	haystack.add(new LineNumberNode(1, new LabelNode()));
	haystack.add(new VarInsnNode(ALOAD, 0));
	haystack.add(new LabelNode());
	haystack.add(new LineNumberNode(1, new LabelNode()));
	haystack.add(new LabelNode());
	haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
	haystack.add(new LabelNode());

	// the labels/line numbers before and after the needle stay, but the labels/line numbers
	// inside the needle are included in the replacement
	ASMHelper.findAndReplace(haystack, needle, replacement);
	assertEquals(3, haystack.size());
}
