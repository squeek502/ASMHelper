package squeek.asmhelper;

import static org.junit.Assert.assertEquals;
import java.net.URL;
import net.minecraft.launchwrapper.LaunchClassLoader;
import org.junit.Test;
import cpw.mods.fml.common.asm.transformers.deobf.FMLDeobfuscatingRemapper;

public class TestObfHelper
{
	public static final String MINECRAFT_VERSION = "1.7.10";

	private static final FMLDeobfuscatingRemapper remapper = FMLDeobfuscatingRemapper.INSTANCE;
	static
	{
		remapper.setup(null, new LaunchClassLoader(new URL[]{}), "/deobfuscation_data-" + MINECRAFT_VERSION + ".lzma");
	}

	public static final String deobfClassName = "net.minecraft.item.ItemStack";
	public static final String deobfInternalClassName = deobfClassName.replace('.', '/');
	public static final String deobfDescriptor = "L" + deobfInternalClassName + ";";

	public static final String obfClassName = "add";
	public static final String obfInternalClassName = obfClassName.replace('.', '/');
	public static final String obfDescriptor = "L" + obfInternalClassName + ";";

	@Test
	public void testConditionalObfAndDeobf()
	{
		ObfHelper.setObfuscated(false);
		assertEquals(deobfClassName, ObfHelper.toObfClassName(deobfClassName));
		assertEquals(obfClassName, ObfHelper.toDeobfClassName(obfClassName));

		ObfHelper.setObfuscated(true);
		assertEquals(obfClassName, ObfHelper.toObfClassName(deobfClassName));
		assertEquals(deobfClassName, ObfHelper.toDeobfClassName(obfClassName));
	}

	@Test
	public void testForceObfAndDeobf()
	{
		ObfHelper.setObfuscated(false);
		assertEquals(obfClassName, ObfHelper.forceToObfClassName(deobfClassName));
		assertEquals(deobfClassName, ObfHelper.forceToDeobfClassName(obfClassName));

		ObfHelper.setObfuscated(true);
		assertEquals(obfClassName, ObfHelper.forceToObfClassName(deobfClassName));
		assertEquals(deobfClassName, ObfHelper.forceToDeobfClassName(obfClassName));
	}

	@Test
	public void testDescriptor()
	{
		ObfHelper.setObfuscated(false);
		assertEquals(deobfDescriptor, ObfHelper.getDescriptor(deobfClassName));

		ObfHelper.setObfuscated(true);
		assertEquals(obfDescriptor, ObfHelper.getDescriptor(deobfClassName));
	}

	@Test
	public void testInternalName()
	{
		ObfHelper.setObfuscated(false);
		assertEquals(deobfInternalClassName, ObfHelper.getInternalClassName(deobfClassName));

		ObfHelper.setObfuscated(true);
		assertEquals(obfInternalClassName, ObfHelper.getInternalClassName(deobfClassName));
	}

	@Test
	public void testMethodDesc()
	{
		String deobfMethodDesc = "(I" + deobfDescriptor + "II" + deobfDescriptor + "Z)" + deobfDescriptor;
		String obfMethodDesc = "(I" + obfDescriptor + "II" + obfDescriptor + "Z)" + obfDescriptor;

		ObfHelper.setObfuscated(false);
		assertEquals(deobfMethodDesc, ObfHelper.methodDesc(deobfMethodDesc));

		ObfHelper.setObfuscated(true);
		assertEquals(obfMethodDesc, ObfHelper.methodDesc(deobfMethodDesc));
	}
}
