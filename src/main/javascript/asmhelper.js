var Opcodes = Java.type("org.objectweb.asm.Opcodes");
var InsnList = Java.type("org.objectweb.asm.tree.InsnList");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var VarInsnNode = Java.type("org.objectweb.asm.tree.VarInsnNode");
var MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
var JumpInsnNode = Java.type("org.objectweb.asm.tree.JumpInsnNode");
var InsnNode = Java.type("org.objectweb.asm.tree.InsnNode");
var MethodNode = Java.type("org.objectweb.asm.tree.MethodNode");
var AbstractInsnNode = Java.type("org.objectweb.asm.tree.AbstractInsnNode");
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
	 * @return The first instruction for which {@link AbstractInsnNode#getOpcode()} == {@code opcode} (could be {@code firstInsnToCheck}).
	 * If {@code reverseDirection} is {@code true}, instructions will be traversed backwards (using getPrevious()).
	 * If a matching instruction cannot be found, returns {@code null}.
	 */
	/*AbstractInsnNode*/ getOrFindInstructionWithOpcode: function(/*AbstractInsnNode*/ firstInsnToCheck, /*int*/ opcode, /*boolean*/ reverseDirection)
	{
		for (var instruction = firstInsnToCheck; instruction != null; instruction = reverseDirection ? instruction.getPrevious() : instruction.getNext())
		{
			if (instruction.getOpcode() == opcode)
				return instruction;
		}
		return null;
	},
	/**
	 * @return The next instruction after {@code instruction} for which {@link AbstractInsnNode#getOpcode()} == {@code opcode}
	 * (excluding {@code instruction}).
	 * If a matching instruction cannot be found, returns {@code null}.
	 */
	/*AbstractInsnNode*/ findNextInstructionWithOpcode: function(/*AbstractInsnNode*/ instruction, /*int*/ opcode)
	{
		return this.getOrFindInstructionWithOpcode(instruction.getNext(), opcode);
	},
	/**
	 * Remove instructions from {@code insnList} starting with {@code startInclusive}
	 * up until reaching {@code endNotInclusive} ({@code endNotInclusive} will not be removed).
	 *
	 * @return The number of instructions removed
	 */
	/*int*/ removeFromInsnListUntil: function(/*InsnList*/ insnList, /*AbstractInsnNode*/ startInclusive, /*AbstractInsnNode*/ endNotInclusive)
	{
		var insnToRemove = startInclusive;
		var numDeleted = 0;
		while (insnToRemove != null && insnToRemove != endNotInclusive)
		{
			numDeleted++;
			insnToRemove = insnToRemove.getNext();
			insnList.remove(insnToRemove.getPrevious());
		}
		return numDeleted;
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
	 * @return Whether or not the instruction is a label or a line number.
	 */
	/*boolean*/ isLabelOrLineNumber: function(/*AbstractInsnNode*/ insn)
	{
		return insn.getType() == AbstractInsnNode.LABEL || insn.getType() == AbstractInsnNode.LINE;
	},
	/**
	 * Convenience method for accessing {@link InsnComparator#areInsnsEqual}
	 */
	instructionsMatch: function(first, second)
	{
		return this.InsnComparator.areInsnsEqual(first, second);
	},
	/**
	 * @return Whether or not the pattern in {@code checkFor} matches starting at {@code checkAgainst}
	 */
	/*boolean*/ patternMatches: function(/*InsnList*/ checkFor, /*AbstractInsnNode*/ checkAgainst)
	{
		return this.checkForPatternAt(checkFor, checkAgainst).getFirst() != null;
	},
	/**
	 * Checks whether or not the pattern in {@code checkFor} matches, starting at {@code checkAgainst}.
	 *
	 * @return All of the instructions that were matched by the {@code checkFor} pattern.
	 * If the pattern was not found, returns an empty {@link InsnList}.<br>
	 * <br>
	 * Note: If the pattern was matched, the size of the returned {@link InsnList} will be >= {@code checkFor}.size().
	 */
	/*InsnList*/ checkForPatternAt: function(/*InsnList*/ checkFor, /*AbstractInsnNode*/ checkAgainst)
	{
		var foundInsnList = new InsnList();
		var firstNeedleFound = false;
		var lookFor = checkFor.getFirst();
		while (lookFor != null)
		{
			if (checkAgainst == null)
				return new InsnList();

			if (this.isLabelOrLineNumber(lookFor))
			{
				lookFor = lookFor.getNext();
				continue;
			}

			if (this.isLabelOrLineNumber(checkAgainst))
			{
				if (firstNeedleFound)
					foundInsnList.add(checkAgainst);
				checkAgainst = checkAgainst.getNext();
				continue;
			}

			if (!this.instructionsMatch(lookFor, checkAgainst))
				return new InsnList();

			foundInsnList.add(checkAgainst);
			lookFor = lookFor.getNext();
			checkAgainst = checkAgainst.getNext();
			firstNeedleFound = true;
		}
		return foundInsnList;
	},
	/**
	 * Searches for the pattern in {@code needle}, starting at {@code haystackStart}.
	 *
	 * @return All of the instructions that were matched by the pattern.
	 * If the pattern was not found, returns an empty {@link InsnList}.<br>
	 * <br>
	 * Note: If the pattern was matched, the size of the returned {@link InsnList} will be >= {@code checkFor}.size().
	 */
	/*InsnList*/ findAndGetFoundInsnList: function(/*AbstractInsnNode*/ haystackStart, /*InsnList*/ needle)
	{
		var needleStartOpcode = needle.getFirst().getOpcode();
		var checkAgainstStart = this.getOrFindInstructionWithOpcode(haystackStart, needleStartOpcode);
		while (checkAgainstStart != null)
		{
			var found = this.checkForPatternAt(needle, checkAgainstStart);

			if (found.getFirst() != null)
				return found;

			checkAgainstStart = this.findNextInstructionWithOpcode(checkAgainstStart, needleStartOpcode);
		}
		return new InsnList();
	},
	/**
	 * Searches for an instruction matching {@code needle}, starting at {@code haystackStart}.
	 *
	 * @return The matching instruction.
	 * If a matching instruction was not found, returns {@code null}.
	 */
	/*AbstractInsnNode*/ find: function(/*AbstractInsnNode or InsnList*/ haystackStart, /*AbstractInsnNode or InsnList*/ needleStart)
	{
		var needle = new InsnList();
		if (haystackStart instanceof InsnList) {
			haystackStart = haystackStart.getFirst();
		}
		if (needleStart instanceof InsnList) {
			needle = needleStart;
		} else {
			needle.add(needleStart);
		}

		if (needle.getFirst() == null)
			return null;

		var found = this.findAndGetFoundInsnList(haystackStart, needle);
		return found.getFirst();
	},
	/**
	 * Searches for the pattern in {@code needle} within {@code haystack} (starting at {@code haystackStart})
	 * and replaces it with {@code replacement}.
	 *
	 * @return The instruction after the replacement.
	 * If the pattern was not found, returns {@code null}.
	 */
	/*AbstractInsnNode*/ findAndReplace: function(/*InsnList*/ haystack, /*InsnList*/ needle, /*InsnList*/ replacement, /*AbstractInsnNode*/ haystackStart)
	{
		if (!haystackStart) haystackStart = haystack.getFirst();
		var found = this.findAndGetFoundInsnList(haystackStart, needle);
		if (found.getFirst() != null)
		{
			haystack.insertBefore(found.getFirst(), replacement);
			var afterNeedle = found.getLast().getNext();
			this.removeFromInsnListUntil(haystack, found.getFirst(), afterNeedle);
			return afterNeedle;
		}
		return null;
	},
	/**
	 * Searches for all instances of the pattern in {@code needle} within {@code haystack}
	 * (starting at {@code haystackStart}) and replaces them with {@code replacement}.
	 *
	 * @return The number of replacements made.
	 */
	/*int*/ findAndReplaceAll: function(/*InsnList*/ haystack, /*InsnList*/ needle, /*InsnList*/ replacement, /*AbstractInsnNode*/ haystackStart)
	{
		if (!haystackStart) haystackStart = haystack.getFirst();
		var numReplaced = 0;
		// insert/insertBefore clears the replacement list, so we need to use a copy each time
		while ((haystackStart = this.findAndReplace(haystack, needle, this.cloneInsnList(replacement), haystackStart)) != null)
		{
			numReplaced++;
		}
		return numReplaced;
	},
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