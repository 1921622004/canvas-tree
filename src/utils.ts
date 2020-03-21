import TreeNode from "./treeNode";
import { Scene, Polyline, Layer } from "spritejs";

export enum ReturnFlag {
  CONTINUE_LOOP = 1,
  NEXT_LOOP = 2,
  FINISH = 3,
  PREV_LOOP = 4
}

interface workRes {
  node: TreeNode;
  flag: ReturnFlag;
  res?: any
}

let timer: number;

type Work = (node: TreeNode, arg: any) => Promise<workRes>;

export const performWorkAtNode = (node: TreeNode, works: Work[], arg: any) => {
  return new Promise((resolve, reject) => {
    let index = -1;
    function next(i: number) {
      index = i;
      let curWork = works[i];
      if (!curWork) return;
      setTimeout(async () => {
        let { node: returnNode, flag, res } = await curWork(node, arg);
        arg = res;
        node = returnNode;
        if (flag === ReturnFlag.CONTINUE_LOOP) {
          next(i);
        } else if (flag === ReturnFlag.NEXT_LOOP) {
          next(i + 1);
        } else if (flag === ReturnFlag.PREV_LOOP) {
          next(i - 1);
        } else {
          timer = null;
          resolve(returnNode);
          return
        }
      }, 300);
    }
    next(0);
  })
}

export function clearArcFun(x: number, y: number, r: number, cxt: CanvasRenderingContext2D) {
  var stepClear = 1;
  clearArc(x, y, r);
  function clearArc(x: number, y: number, radius: number) {
    var calcWidth = radius - stepClear;
    var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
    var posX = x - calcWidth;
    var posY = y - calcHeight;
    var widthX = 2 * calcWidth;
    var heightY = 2 * calcHeight;
    if (stepClear <= radius) {
      cxt.clearRect(posX, posY, widthX, heightY);
      stepClear += 1;
      clearArc(x, y, radius);
    }
  }
}


export function drawLineBetweenNodes(parent: TreeNode, child: TreeNode, layer: Layer) {
  let [parentX, parentY] = parent.position;
  let [childX, childY] = child.position;
  let isLeftChild = parent.val > child.val;
  let a = Math.abs(parentX - childX);
  let b = Math.abs(parentY - childY);
  let c = Math.sqrt(a * a + b * b);
  let startX = isLeftChild ? parentX - a / c * 25 : parentX + a / c * 25;
  console.log('startX: ', startX);
  let startY = parentY + b / c * 25;
  console.log('startY: ', startY);
  let endX = isLeftChild ? childX + a / c * 25 : childX - a / c * 25;
  console.log('endX: ', endX);
  let endY = childY - b / c * 25;
  console.log('endY: ', endY);
  let line = new Polyline({
    points: [startX, startY, endX, endY],
    smooth: false,
    strokeColor: '#000'
  });
  if (isLeftChild) {
    parent.leftLine && parent.leftLine.remove();
    parent.leftLine = line;
  } else {
    parent.rightLine && parent.rightLine.remove();
    parent.rightLine = line;
  }
  layer.append(line);
}