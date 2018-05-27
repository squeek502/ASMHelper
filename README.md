ASMHelper
=========

A library of classes to help with ASM transformations in Minecraft mods

Intended to be used as a git submodule and Gradle subproject
- Add the submodule using `git submodule add -b 1.12.x https://github.com/squeek502/ASMHelper.git ASMHelper`
- Add it as a Gradle subproject by creating a `settings.gradle` file with the contents: `include ":ASMHelper"`
- Initialize the submodule using `git submodule update --init`
- Running `gradle eclipse` or `gradle idea` or `gradle build` will generate an ASMHelper package specific to your root gradle project (it uses the `group` property of the root project) and add it to your classpath
- Anytime you want to update the submodule, do the following:
 1. Run `git submodule update --remote --merge`
 2. Run one of the above `gradle` commands or `gradle ASMHelper:generateProjectSpecificPackage` to regenerate the ASMHelper source files
- If you make changes to the files in the `gen` directory, you can copy them to `raw` (so that they don't get overwritten on the next `ASMHelper:generateProjectSpecificPackage` task) by running `gradle ASMHelper:reincorporate`

Note: The reason for the Gradle subproject is to avoid issues caused by multiple mods distributing the same package (the class loader simply loads the first instance it finds, which is not always the most up-to-date).
