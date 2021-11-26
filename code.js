figma.showUI(__html__);
figma.ui.resize(400, 300);
const selection = figma.currentPage.selection.slice();
//Cur and next layers of nodes tree 
let nodes = selection;
;
let nodeChilds = [];
//Amount of processed objects
let numObjects = 0;
//Processing tree with breadth-first search
function calcLayer() {
    //Using setTimeout to divide calculations on parts - one part is one layer
    setTimeout(() => {
        nodeChilds = [];
        for (const node of nodes) {
            if ("fills" in node) {
                const array = node.fills.valueOf();
                const keys = Object.keys(array);
                const arrayLen = keys.length;
                const newFills = [];
                // Find the last row of fills that begins from the fill with opacity 1
                for (const key of keys) {
                    if (typeof node.fills[key] != "string") {
                        if ("opacity" in node.fills[key]) {
                            if (node.fills[key].opacity == 1) {
                                newFills.length = 0;
                            }
                            newFills.push(node.fills[key]);
                        }
                    }
                }
                //Rewrite fills we found shorter row
                if (arrayLen > newFills.length) {
                    numObjects++;
                    figma.ui.postMessage(numObjects);
                    node.fills = newFills;
                }
            }
            if ("children" in node) {
                for (const child of node.children) {
                    nodeChilds.push(child);
                }
            }
        }
        nodes = nodeChilds;
        //Continue if there is a next layer
        //Send to UI a message if there weren't objects to process
        if (nodeChilds.length > 0) {
            calcLayer();
        }
        else if (numObjects == 0) {
            figma.ui.postMessage(-2);
        }
    }, 1);
}
//Begining of tree processing!
if (selection.length != 0) {
    calcLayer();
}
else {
    figma.ui.postMessage(-1);
}
figma.ui.onmessage = (message) => {
    if (message === "finishProg") {
        figma.closePlugin();
    }
};
