function main() {
    figma.showUI(__html__);
    figma.ui.resize(400, 300);
    let i = 0;
    const selection = figma.currentPage.selection.slice();
    let nodes = [];
    let nodeChilds = [];
    nodes = selection;
    if (selection.length == 0) {
        figma.ui.postMessage(-1);
    }
    let numObjects = 0;
    function calcLayer() {
        setTimeout(() => {
            nodeChilds = [];
            for (const node of nodes) {
                if ("fills" in node) {
                    const array = node.fills.valueOf();
                    if (Object.keys(array).length > 1) {
                        numObjects++;
                        figma.ui.postMessage(numObjects);
                    }
                    node.fills = [node.fills[Object.keys(array).length - 1]];
                }
                if ("children" in node) {
                    for (const child of node.children) {
                        nodeChilds.push(child);
                    }
                }
            }
            nodes = nodeChilds;
            if (nodeChilds.length > 0) {
                calcLayer();
            }
        }, 1);
    }
    calcLayer();
    // figma.ui.postMessage(numObjects);
    figma.ui.onmessage = (message) => {
        if (message === "finishProg") {
            figma.closePlugin();
        }
    };
}
main();
