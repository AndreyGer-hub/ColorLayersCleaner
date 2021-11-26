figma.showUI(__html__);
figma.ui.resize(400,300);

let i=0;
const selection = figma.currentPage.selection.slice();

let nodes = [];
let nodeChilds = [];
nodes = selection;



let numObjects = 0;

function calcLayer(){
  setTimeout(() => {

    nodeChilds = [];
    for( const node of nodes ){ 

        if ("fills" in node) {
          const array = node.fills.valueOf();
          const arrayLen = Object.keys(array).length;

          const newFills = [];
          
          // Find the last row in fills that begins from the fill with opacity 1
          for(const fill of node.fills){
            if(typeof fill != "string"){
              if("opacity" in fill){

                if(fill.opacity == 1){
                  newFills.length = 0;
                }
                newFills.push(fill);

              }
            }
          }

          if(arrayLen > newFills.length){
            numObjects++;
            figma.ui.postMessage(numObjects);
          }

          node.fills=newFills;
        }

        if("children" in node){
          for( const child of node.children){
            nodeChilds.push(child);
          }
        }
      
    }

    nodes = nodeChilds;

    if(nodeChilds.length > 0){
      calcLayer();
    }else if(numObjects==0){
      figma.ui.postMessage(-2);
    }
  }, 1);

}

if(selection.length == 0){
  figma.ui.postMessage(-1);
}else{
  calcLayer();
}

figma.ui.onmessage = (message) => {
  if(message === "finishProg"){
    figma.closePlugin();
  }
}
