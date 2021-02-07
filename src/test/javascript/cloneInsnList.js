var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var FieldInsnNode = Java.type("org.objectweb.asm.tree.FieldInsnNode");
var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var LineNumberNode = Java.type("org.objectweb.asm.tree.LineNumberNode");
var MethodNode = Java.type("org.objectweb.asm.tree.MethodNode");
var Label = Java.type("org.objectweb.asm.Label");
var ALOAD = Opcodes.ALOAD;
var GETFIELD = Opcodes.GETFIELD;
var RETURN = Opcodes.RETURN;
var ACC_PUBLIC = Opcodes.ACC_PUBLIC;
var INVOKESPECIAL = Opcodes.INVOKESPECIAL;
var BIPUSH = Opcodes.BIPUSH;
var PUTFIELD = Opcodes.PUTFIELD;

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');

	var HashMap = Java.type("java.util.HashMap");
	var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
	var instruction = new LabelNode();
	var map = {};
	instruction.clone(map);
/*
	var mv = new MethodNode(ACC_PUBLIC, "<init>", "()V", null, null);
	mv.visitCode();
	var l0 = new Label();
	mv.visitLabel(l0);
	mv.visitLineNumber(20, l0);
	mv.visitVarInsn(ALOAD, 0);
	mv.visitMethodInsn(INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
	var l1 = new Label();
	mv.visitLabel(l1);
	mv.visitLineNumber(14, l1);
	mv.visitVarInsn(ALOAD, 0);
	mv.visitIntInsn(BIPUSH, 20);
	mv.visitFieldInsn(PUTFIELD, "net/minecraft/util/FoodStats", "foodLevel", "I");
	var l2 = new Label();
	mv.visitLabel(l2);
	mv.visitLineNumber(18, l2);
	mv.visitVarInsn(ALOAD, 0);
	mv.visitIntInsn(BIPUSH, 20);
	mv.visitFieldInsn(PUTFIELD, "net/minecraft/util/FoodStats", "prevFoodLevel", "I");
	var l3 = new Label();
	mv.visitLabel(l3);
	mv.visitLineNumber(21, l3);
	mv.visitVarInsn(ALOAD, 0);
	mv.visitLdcInsn(5.0);
	mv.visitFieldInsn(PUTFIELD, "net/minecraft/util/FoodStats", "foodSaturationLevel", "F");
	var l4 = new Label();
	mv.visitLabel(l4);
	mv.visitLineNumber(22, l4);
	mv.visitInsn(RETURN);
	var l5 = new Label();
	mv.visitLabel(l5);
	mv.visitLocalVariable("this", "Lnet/minecraft/util/FoodStats;", null, l0, l5, 0);
	mv.visitMaxs(2, 1);
	mv.visitEnd();

	var cloned = ASMHelper.cloneInsnList(mv.instructions);
	print(cloned);
	*/
}
