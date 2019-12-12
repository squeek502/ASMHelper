var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
var JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
var MethodNode = Java.type("org.objectweb.asm.tree.MethodNode");
var Type = Java.type("org.objectweb.asm.Type");
var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");

var ASMHelper = {
	/**
	 * Converts a class name to an internal class name.
	 * @return internal/class/name
	 */
	toInternalClassName: function(className) {
		return className.replace('.', '/');
	},
	/**
	 * @return true if the String is a valid descriptor;
	 */
	isDescriptor: function(descriptor) {
		return descriptor.length == 1 || (descriptor.startsWith("L") && descriptor.endsWith(";"));
	},
	/**
	 * Converts a class name to a descriptor.
	 * @return Linternal/class/name;
	 */
	toDescriptor: function(className) {
		return this.isDescriptor(className) ? className : "L" + this.toInternalClassName(className) + ";";
	},
	/**
	 * Turns the given return and parameter values into a method descriptor
	 * Converts the types into descriptors as needed
	 * @return (LparamType;)LreturnType;
	 */
	toMethodDescriptor: function(returnType) {
		// gather the rest of the arguments as an array, but exclude the first argument
		var paramTypes = Array.prototype.slice.call(arguments);
		paramTypes.shift();

		var paramDescriptors = paramTypes.map(this.toDescriptor.bind(this)).join("");
		return "(" + paramDescriptors + ")" + this.toDescriptor(returnType);
	},
	/**
	 * @return The method of the class that has both a matching {@code methodName} and {@code methodDesc}.
	 * If no matching method is found, returns {@code null}.
	 */
	findMethodNodeOfClass: function(classNode, methodName, methodDesc) {
		return classNode.methods.find(function(method) {
			return method.name == methodName && (!methodDesc || method.desc == methodDesc)
		});
	},
	/**
	 * Clones an instruction list, remapping labels in the process.
	 *
	 * @return The cloned {@code InsnList}
	 */
	cloneInsnList: function(source) {
		var clone = new InsnList();

		// used to map the old labels to their cloned counterpart
		var labelMap = {};

		// build the label map
		var instruction;
		for (instruction = source.getFirst(); instruction != null; instruction = instruction.getNext())
		{
			if (instruction instanceof LabelNode)
			{
				labelMap[instruction] = new LabelNode();
			}
		}

		for (instruction = source.getFirst(); instruction != null; instruction = instruction.getNext())
		{
			clone.add(instruction.clone(labelMap));
		}

		return clone;
	},
	/**
	 * @return The first instruction of the {@code method} for which {@link AbstractInsnNode#getOpcode()} == {@code opcode}.
	 * If a matching instruction cannot be found, returns {@code null}.
	 */
	findFirstInstructionWithOpcode: function(method, opcode)
	{
		return ASMAPI.findFirstInstruction(method, opcode);
	},

	/**
	 * Convenience method for accessing {@link InsnComparator#areInsnsEqual}
	 */
	instructionsMatch: function(first, second)
	{
		return ASMHelper.InsnComparator.areInsnsEqual(first, second);
	}
}

ASMHelper.InsnComparator = {
	INT_WILDCARD: -1,
	WILDCARD: "*",

	compare: function(a, b) {
		return this.areInsnsEqual(a, b) ? 0 : 1;
	},

	/**
	 * Respects {@link #INT_WILDCARD} and {@link #WILDCARD} instruction properties.
	 * Always returns true if {@code a} and {@code b} are label, line number, or frame instructions.
	 *
	 * @return Whether or not the given instructions are equivalent.
	 */
	areInsnsEqual: function(a, b)
	{
		if (a == b)
			return true;

		if (a == null || b == null)
			return false;

		if (a.equals(b))
			return true;

		if (a.getOpcode() != b.getOpcode())
			return false;

		var AbstractInsnNode = Java.type("org.objectweb.asm.tree.AbstractInsnNode");
		switch (a.getType())
		{
			case AbstractInsnNode.VAR_INSN:
				return this.areVarInsnsEqual(a, b);
			case AbstractInsnNode.TYPE_INSN:
				return this.areTypeInsnsEqual(a, b);
			case AbstractInsnNode.FIELD_INSN:
				return this.areFieldInsnsEqual(a, b);
			case AbstractInsnNode.METHOD_INSN:
				return this.areMethodInsnsEqual(a, b);
			case AbstractInsnNode.LDC_INSN:
				return this.areLdcInsnsEqual(a, b);
			case AbstractInsnNode.IINC_INSN:
				return this.areIincInsnsEqual(a, b);
			case AbstractInsnNode.INT_INSN:
				return this.areIntInsnsEqual(a, b);
			default:
				return true;
		}
	},

	areVarInsnsEqual: function(a, b)
	{
		return this.intValuesMatch(a.var, b.var);
	},

	areTypeInsnsEqual: function(a, b)
	{
		return this.valuesMatch(a.desc, b.desc);
	},

	areFieldInsnsEqual: function(a, b)
	{
		return this.valuesMatch(a.owner, b.owner) && this.valuesMatch(a.name, b.name) && this.valuesMatch(a.desc, b.desc);
	},

	areMethodInsnsEqual: function(a, b)
	{
		return this.valuesMatch(a.owner, b.owner) && this.valuesMatch(a.name, b.name) && this.valuesMatch(a.desc, b.desc);
	},

	areIntInsnsEqual: function(a, b)
	{
		return this.intValuesMatch(a.operand, b.operand);
	},

	areIincInsnsEqual: function(a, b)
	{
		return this.intValuesMatch(a.var, b.var) && this.intValuesMatch(a.incr, b.incr);
	},

	areLdcInsnsEqual: function(a, b)
	{
		return this.valuesMatch(a.cst, b.cst);
	},

	intValuesMatch: function(a, b)
	{
		return a == b || a == this.INT_WILDCARD || b == this.INT_WILDCARD;
	},

	valuesMatch: function(a, b)
	{
		return a == b || a == this.WILDCARD || b == this.WILDCARD;
	},
}