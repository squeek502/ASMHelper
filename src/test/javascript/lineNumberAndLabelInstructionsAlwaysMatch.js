var ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
var LabelNode = Java.type("org.objectweb.asm.tree.LabelNode");
var LineNumberNode = Java.type("org.objectweb.asm.tree.LineNumberNode");

function initializeCoreMod() {
	ASMAPI.loadFile('../../main/javascript/asmhelper.js');
	ASMAPI.loadFile('utils/jankytest.js');

	assertTrue(ASMHelper.instructionsMatch(new LabelNode(), new LabelNode()));
	assertTrue(ASMHelper.instructionsMatch(new LineNumberNode(0, new LabelNode()), new LineNumberNode(0, new LabelNode())));
	assertTrue(ASMHelper.instructionsMatch(new LineNumberNode(0, new LabelNode()), new LineNumberNode(100, new LabelNode())));
}
