var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var LdcInsnNode = Java.type("org.objectweb.asm.tree.LdcInsnNode");

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('jankytest.js');
	var InsnComparator = ASMHelper.InsnComparator;

	assertTrue(ASMHelper.instructionsMatch(new VarInsnNode(Opcodes.ALOAD, 0), new VarInsnNode(Opcodes.ALOAD, InsnComparator.INT_WILDCARD)));
	assertTrue(ASMHelper.instructionsMatch(new LdcInsnNode("test"), new LdcInsnNode(InsnComparator.WILDCARD)));
}
