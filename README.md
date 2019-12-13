ASMHelper
=========

A library of functions to help with ASM transformations in Minecraft mods

With Forge > 1.14, [Forge CoreMods](https://github.com/MinecraftForge/CoreMods) are now implemented in Javascript.
This branch is a **work-in-progress** port of ASMHelper from Java to Javascript in order to make it easier to port mods that used ASMHelper to 1.14+.

To use the Javascript version, put [asmhelper.js](src/main/javascript/asmhelper.js) next to your core mod's javascript file and load it in your `initializeCoreMods` function like so:

```js
function initializeCoreMod() {
    Java.type("net.minecraftforge.coremod.api.ASMAPI").loadFile("asmhelper.js");

    // ASMHelper is now an object in the global namespace

    return {
        "FoodStatsTransformer": {
            "target": {
                "type": "CLASS",
                "name": "net.minecraft.util.FoodStats"
            },
            "transformer": function(classNode) {
                var internalClass = ASMHelper.toInternalClassName("some.package.IClassName");
                classNode.interfaces.add(internalClass);
                return classNode;
            }
        }
    }
}
```