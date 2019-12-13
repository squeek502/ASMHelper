var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var LdcInsnNode = Java.type("org.objectweb.asm.tree.LdcInsnNode");
var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');

	assertTrue(ASMHelper.instructionsMatch(new InsnNode(Opcodes.RETURN), new InsnNode(Opcodes.RETURN)));
	assertTrue(ASMHelper.instructionsMatch(new VarInsnNode(Opcodes.ALOAD, 0), new VarInsnNode(Opcodes.ALOAD, 0)));
	assertFalse(ASMHelper.instructionsMatch(new VarInsnNode(Opcodes.ILOAD, 0), new VarInsnNode(Opcodes.ALOAD, 0)));
	assertFalse(ASMHelper.instructionsMatch(new VarInsnNode(Opcodes.ALOAD, 0), new VarInsnNode(Opcodes.ALOAD, 1)));
	assertTrue(ASMHelper.instructionsMatch(new LdcInsnNode("test"), new LdcInsnNode("test")));
	assertFalse(ASMHelper.instructionsMatch(new LdcInsnNode("test"), new LdcInsnNode("test-diff")));
}
