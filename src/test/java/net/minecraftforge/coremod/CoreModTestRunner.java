package net.minecraftforge.coremod;

import org.junit.jupiter.api.Assertions;

import java.lang.reflect.Field;
import java.util.List;

public class CoreModTestRunner
{
	@SuppressWarnings("unchecked")
	public static void runJavascriptTest(String path)
	{
		final CoreModEngine coreModEngine = new CoreModEngine();
		coreModEngine.loadCoreMod(new JSFileLoader("src/test/javascript/" + path));
		try
		{
			CoreMod coreMod = ((List<CoreMod>) coreMods.get(coreModEngine)).get(0);
			coreMod.initialize();
			if (coreMod.hasError())
			{
				Assertions.fail(coreMod.getError().toString());
			}
		}
		catch (IllegalAccessException e)
		{
			throw new RuntimeException(e);
		}
	}

	private static Field coreMods = null;

	static
	{
		try
		{
			coreMods = CoreModEngine.class.getDeclaredField("coreMods");
			coreMods.setAccessible(true);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
