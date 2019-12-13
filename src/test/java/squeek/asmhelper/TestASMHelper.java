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

	@Test
	void findAndReplaceReturnsTheInstructionAfterTheReplacement()
	{
		CoreModTestRunner.runJavascriptTest("findAndReplaceReturnsTheInstructionAfterTheReplacement.js");
	}

	@Test
	void findAndReplaceReturnsNullWhenNothingIsReplaced()
	{
		CoreModTestRunner.runJavascriptTest("findAndReplaceReturnsNullWhenNothingIsReplaced.js");
	}

	@Test
	void findAndReplaceAllReturnsNumberOfReplacementsMade()
	{
		CoreModTestRunner.runJavascriptTest("findAndReplaceAllReturnsNumberOfReplacementsMade.js");
	}

	@Test
	void findAndReplaceAllReplacesCorrectly()
	{
		CoreModTestRunner.runJavascriptTest("findAndReplaceAllReplacesCorrectly.js");
	}

	@Test
	void findAndReplaceHandlesLabelsCorrectly()
	{
		CoreModTestRunner.runJavascriptTest("findAndReplaceHandlesLabelsCorrectly.js");
	}

	@Test
	void dontPolluteGlobals()
	{
		CoreModTestRunner.runJavascriptTest("dontPolluteGlobals.js");
	}
}
