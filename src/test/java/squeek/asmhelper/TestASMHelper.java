package squeek.asmhelper;

import net.minecraftforge.coremod.CoreModTestRunner;
import org.junit.jupiter.api.Test;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.FieldInsnNode;
import org.objectweb.asm.tree.LineNumberNode;

public class TestASMHelper
{
	@Test
	void toMethodDescriptor()
	{
		CoreModTestRunner.runJavascriptTest("toMethodDescriptor.js");
	}

	@Test
	void instructionMatchingMustMatchExactly()
	{
		CoreModTestRunner.runJavascriptTest("instructionMatchingMustMatchExactly.js");
	}

	@Test
	void instructionMatchingHasWildcardSupport()
	{
		CoreModTestRunner.runJavascriptTest("instructionMatchingHasWildcardSupport.js");
	}

	@Test
	void lineNumberAndLabelInstructionsAlwaysMatch()
	{
		CoreModTestRunner.runJavascriptTest("lineNumberAndLabelInstructionsAlwaysMatch.js");
	}

	@Test
	void patternMatchingIgnoresLabelsAndLineNumbers()
	{
		CoreModTestRunner.runJavascriptTest("patternMatchingIgnoresLabelsAndLineNumbers.js");
	}

	@Test
	void patternNeedlesCanNotBeLargerThanTheHaystack()
	{
		CoreModTestRunner.runJavascriptTest("patternNeedlesCanNotBeLargerThanTheHaystack.js");
	}

	@Test
	void patternNeedlesCanBeSmallerThanTheHaystack()
	{
		CoreModTestRunner.runJavascriptTest("patternNeedlesCanBeSmallerThanTheHaystack.js");
	}

	@Test
	void findReturnsTheStartOfTheNeedleFoundInTheHaystack()
	{
		CoreModTestRunner.runJavascriptTest("findReturnsTheStartOfTheNeedleFoundInTheHaystack.js");
	}

	@Test
	void findReturnsNullWhenNeedleIsNotFoundOrEmpty()
	{
		CoreModTestRunner.runJavascriptTest("findReturnsNullWhenNeedleIsNotFoundOrEmpty.js");
	}
/*
	@Test
	public void findAndReplaceReturnsTheInstructionAfterTheReplacement()
	{
		InsnList needle = new InsnList();
		InsnList haystack = populateTestHaystack(new InsnList());
		InsnList replacement = new InsnList();

		needle.add(new VarInsnNode(ALOAD, 0));
		needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, "foodLevel", "I"));
		needle.add(new VarInsnNode(ISTORE, 3));
		needle.add(new VarInsnNode(ALOAD, 0));

		AbstractInsnNode afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
		assertEquals(haystack.get(2), afterReplacement);

		populateTestHaystack(haystack);
		replacement.add(new VarInsnNode(ALOAD, 0));

		afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
		assertEquals(haystack.get(3), afterReplacement);

		afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
		assertEquals(null, afterReplacement);
	}

	@Test
	public void findAndReplaceReturnsNullWhenNothingIsReplaced()
	{
		InsnList needle = new InsnList();
		InsnList haystack = populateTestHaystack(new InsnList());
		InsnList replacement = new InsnList();

		needle.add(new FieldInsnNode(GETFIELD, "bogusClassInternalName", "bogusMethodName", "bogus"));

		AbstractInsnNode afterReplacement = ASMHelper.findAndReplace(haystack, needle, replacement);
		assertEquals(null, afterReplacement);
	}

	@Test
	public void findAndReplaceAllReturnsNumberOfReplacementsMade()
	{
		InsnList needle = new InsnList();
		InsnList haystack = populateTestHaystack(new InsnList());
		InsnList replacement = new InsnList();

		needle.add(new VarInsnNode(ALOAD, InsnComparator.INT_WILDCARD));
		needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, InsnComparator.WILDCARD, InsnComparator.WILDCARD));

		int numReplaced = ASMHelper.findAndReplaceAll(haystack, needle, replacement);
		assertEquals(6, numReplaced);

		numReplaced = ASMHelper.findAndReplaceAll(haystack, needle, replacement);
		assertEquals(0, numReplaced);
	}

	@Test
	public void findAndReplaceAllReplacesCorrectly()
	{
		InsnList needle = new InsnList();
		InsnList haystack = new InsnList();
		InsnList replacement = new InsnList();
		InsnList result = new InsnList();

		needle.add(new VarInsnNode(ALOAD, InsnComparator.INT_WILDCARD));
		needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, InsnComparator.WILDCARD, InsnComparator.WILDCARD));

		replacement.add(new VarInsnNode(ALOAD, 0));

		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
		haystack.add(new VarInsnNode(ALOAD, 1));
		haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
		haystack.add(new VarInsnNode(ALOAD, 2));
		haystack.add(new FieldInsnNode(GETFIELD, "dummy", "dummy", "dummy"));
		haystack.add(new InsnNode(RETURN));

		result.add(new VarInsnNode(ALOAD, 0));
		result.add(new VarInsnNode(ALOAD, 0));
		result.add(new VarInsnNode(ALOAD, 0));
		result.add(new InsnNode(RETURN));

		ASMHelper.findAndReplaceAll(haystack, needle, replacement);
		assertEquals(4, haystack.size());
		assertTrue(ASMHelper.patternMatches(result, haystack.getFirst()));
	}

	@Test
	public void findAndReplaceHandlesLabelsCorrectly()
	{
		InsnList needle = new InsnList();
		InsnList haystack = new InsnList();
		InsnList replacement = new InsnList();

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
	*/
}
