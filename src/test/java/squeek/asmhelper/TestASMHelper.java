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
/*
	@Test
	public void findReturnsNullWhenNeedleIsNotFoundOrEmpty()
	{
		InsnList needle = new InsnList();
		InsnList haystack = populateTestHaystack(new InsnList());

		assertNull(ASMHelper.find(haystack, needle));

		needle.add(new VarInsnNode(ALOAD, 0));
		needle.add(new FieldInsnNode(GETFIELD, InsnComparator.WILDCARD, "foodLevel", "I"));
		needle.add(new VarInsnNode(ISTORE, 3));
		needle.add(new VarInsnNode(ALOAD, 0));

		assertNull(ASMHelper.find(haystack.get(3), needle));
	}

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

	public InsnList populateTestHaystack(InsnList haystack)
	{
		haystack.clear();
		LabelNode l0 = new LabelNode();
		haystack.add(l0);
		haystack.add(new LineNumberNode(44, l0));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "foodLevel", "I"));
		haystack.add(new VarInsnNode(ISTORE, 3));
		LabelNode l1 = new LabelNode();
		haystack.add(l1);
		haystack.add(new LineNumberNode(45, l1));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "entityplayer", "Lnet/minecraft/entity/player/EntityPlayer;"));
		haystack.add(new VarInsnNode(ALOAD, 1));
		haystack.add(new VarInsnNode(ALOAD, 2));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/item/ItemFood", "func_150905_g", "(Lnet/minecraft/item/ItemStack;)I", false));
		haystack.add(new VarInsnNode(ILOAD, 3));
		haystack.add(new InsnNode(IADD));
		haystack.add(new MethodInsnNode(INVOKESTATIC, "org/bukkit/craftbukkit/event/CraftEventFactory", "callFoodLevelChangeEvent", "(Lnet/minecraft/entity/player/EntityPlayer;I)Lorg/bukkit/event/entity/FoodLevelChangeEvent;", false));
		haystack.add(new VarInsnNode(ASTORE, 4));
		LabelNode l2 = new LabelNode();
		haystack.add(l2);
		haystack.add(new LineNumberNode(47, l2));
		haystack.add(new VarInsnNode(ALOAD, 4));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "org/bukkit/event/entity/FoodLevelChangeEvent", "isCancelled", "()Z", false));
		LabelNode l3 = new LabelNode();
		haystack.add(new JumpInsnNode(IFNE, l3));
		LabelNode l4 = new LabelNode();
		haystack.add(l4);
		haystack.add(new LineNumberNode(49, l4));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new VarInsnNode(ALOAD, 4));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "org/bukkit/event/entity/FoodLevelChangeEvent", "getFoodLevel", "()I", false));
		haystack.add(new VarInsnNode(ILOAD, 3));
		haystack.add(new InsnNode(ISUB));
		haystack.add(new VarInsnNode(ALOAD, 1));
		haystack.add(new VarInsnNode(ALOAD, 2));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/item/ItemFood", "func_150906_h", "(Lnet/minecraft/item/ItemStack;)F", false));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/util/FoodStats", "addStats", "(IF)V", false));
		haystack.add(l3);
		haystack.add(new LineNumberNode(52, l3));
		haystack.add(new FrameNode(Opcodes.F_APPEND, 2, new Object[]{Opcodes.INTEGER, "org/bukkit/event/entity/FoodLevelChangeEvent"}, 0, null));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "entityplayer", "Lnet/minecraft/entity/player/EntityPlayer;"));
		haystack.add(new TypeInsnNode(CHECKCAST, "net/minecraft/entity/player/EntityPlayerMP"));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/entity/player/EntityPlayerMP", "playerNetServerHandler", "Lnet/minecraft/network/NetHandlerPlayServer;"));
		haystack.add(new TypeInsnNode(NEW, "net/minecraft/network/play/server/S06PacketUpdateHealth"));
		haystack.add(new InsnNode(DUP));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "entityplayer", "Lnet/minecraft/entity/player/EntityPlayer;"));
		haystack.add(new TypeInsnNode(CHECKCAST, "net/minecraft/entity/player/EntityPlayerMP"));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/entity/player/EntityPlayerMP", "getBukkitEntity", "()Lorg/bukkit/craftbukkit/entity/CraftPlayer;", false));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "org/bukkit/craftbukkit/entity/CraftPlayer", "getScaledHealth", "()F", false));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "entityplayer", "Lnet/minecraft/entity/player/EntityPlayer;"));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/entity/player/EntityPlayer", "getFoodStats", "()Lnet/minecraft/util/FoodStats;", false));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "foodLevel", "I"));
		haystack.add(new VarInsnNode(ALOAD, 0));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "entityplayer", "Lnet/minecraft/entity/player/EntityPlayer;"));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/entity/player/EntityPlayer", "getFoodStats", "()Lnet/minecraft/util/FoodStats;", false));
		haystack.add(new FieldInsnNode(GETFIELD, "net/minecraft/util/FoodStats", "foodSaturationLevel", "F"));
		haystack.add(new MethodInsnNode(INVOKESPECIAL, "net/minecraft/network/play/server/S06PacketUpdateHealth", "<init>", "(FIF)V", false));
		haystack.add(new MethodInsnNode(INVOKEVIRTUAL, "net/minecraft/network/NetHandlerPlayServer", "sendPacket", "(Lnet/minecraft/network/Packet;)V", false));
		LabelNode l5 = new LabelNode();
		haystack.add(l5);
		haystack.add(new LineNumberNode(54, l5));
		haystack.add(new InsnNode(RETURN));
		LabelNode l6 = new LabelNode();
		haystack.add(l6);

		return haystack;
	}
	*/
}
