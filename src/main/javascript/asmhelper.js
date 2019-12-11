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
	}
}