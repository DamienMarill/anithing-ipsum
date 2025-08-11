// Figma Plugin Main Thread
// This runs in the Figma environment and has access to the Figma API

console.log("Anything Ipsum Figma Plugin loaded!");

// Show the plugin UI
figma.showUI(__html__, {
  width: 400,
  height: 600,
  title: "Anything Ipsum Generator"
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  console.log("Message from UI:", msg);
  
  if (msg.type === 'generate-lorem') {
    try {
      // Get selected text nodes or create a new text node
      const selection = figma.currentPage.selection;
      let textNode: TextNode;
      
      if (selection.length === 1 && selection[0].type === 'TEXT') {
        textNode = selection[0] as TextNode;
      } else {
        // Create new text node
        textNode = figma.createText();
        figma.currentPage.appendChild(textNode);
        
        // Load font before setting text
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      }
      
      // Set the generated text
      textNode.characters = msg.content;
      
      // Select the text node
      figma.currentPage.selection = [textNode];
      figma.viewport.scrollAndZoomIntoView([textNode]);
      
      figma.ui.postMessage({
        type: 'success',
        message: 'Text generated successfully!'
      });
      
    } catch (error) {
      console.error('Error generating text:', error);
      figma.ui.postMessage({
        type: 'error',
        message: 'Failed to generate text: ' + error.message
      });
    }
  }
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};

// This is required to make TypeScript happy
declare global {
  var __html__: string;
}
