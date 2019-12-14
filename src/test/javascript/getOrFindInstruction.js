var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var LineNumberNode = Java.type("org.objectweb.asm.tree.LineNumberNode");
var ALOAD = Opcodes.ALOAD;
var GETFIELD = Opcodes.GETFIELD;
var RETURN = Opcodes.RETURN;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');

	var first = new VarInsnNode(ALOAD, 0);
	var lineNum = (new LineNumberNode(1, new LabelNode()));
	var start = new InsnNode(RETURN);
	var field = new FieldInsnNode(GETFIELD, "", "", "");
	var label = (new LabelNode());
	var last = new VarInsnNode(ALOAD, 2);
	var list = ASMAPI.listOf(first, lineNum, start, field, label, last);

	assertEquals(last, ASMHelper.getOrFindInstructionOfType(start, last.getType()));
	assertEquals(first, ASMHelper.getOrFindInstructionOfType(start, first.getType(), true));
	assertEquals(field, ASMHelper.getOrFindInstructionOfType(start, field.getType()));
	assertEquals(start, ASMHelper.getOrFindInstructionOfType(start, start.getType()));
	assertEquals(start, ASMHelper.getOrFindInstructionOfType(start, start.getType(), true));

	assertEquals(last, ASMHelper.getOrFindInstructionWithOpcode(start, ALOAD));
	assertEquals(first, ASMHelper.getOrFindInstructionWithOpcode(start, ALOAD, true));
	assertEquals(field, ASMHelper.getOrFindInstructionWithOpcode(start, GETFIELD));
	assertEquals(null, ASMHelper.getOrFindInstructionWithOpcode(start, GETFIELD, true));
	assertEquals(start, ASMHelper.getOrFindInstructionWithOpcode(start, RETURN));
	assertEquals(start, ASMHelper.getOrFindInstructionWithOpcode(start, RETURN, true));

	assertEquals(label, ASMHelper.getOrFindLabelOrLineNumber(start));
	assertEquals(lineNum, ASMHelper.getOrFindLabelOrLineNumber(start, true));
	assertEquals(label, ASMHelper.getOrFindLabelOrLineNumber(label));
	assertEquals(null, ASMHelper.getOrFindLabelOrLineNumber(label.getNext()));

	assertEquals(field, ASMHelper.getOrFindInstruction(start.getNext()));
	assertEquals(first, ASMHelper.getOrFindInstruction(start.getPrevious(), true));
}
