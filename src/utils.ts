import TreeNode from "./treeNode";

export enum ReturnFlag {
  CONTINUE_LOOP = 1,
  NEXT_LOOP = 2,
  FINISH = 3
}

interface workRes {
  node: TreeNode;
  flag: ReturnFlag;
  res?: any
}

let timer: number;

type Work = (node: TreeNode, arg: any) => workRes;

export const performWorkAtNode = (node: TreeNode, works: Work[], arg: any) => {
  if (timer) return;
  let index = -1;
  function next(i: number) {
    index = i;
    let curWork = works[i];
    setTimeout(() => {
      let { node: returnNode, flag, res } = curWork(node, arg);
      arg = res;
      node = returnNode;
      if (flag === ReturnFlag.CONTINUE_LOOP) {
        next(i);
      } else if (flag === ReturnFlag.NEXT_LOOP) {
        next(i + 1);
      } else {
        return
      }
    }, 300);
  }
  next(0);
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


export function drawLineBetweenNodes(parent: TreeNode, child: TreeNode, ctx: CanvasRenderingContext2D) {
  let { pX: parentX, pY: parentY } = parent;
  let { pX: childX, pY: childY } = child;
  let isLeftChild = parent.val > child.val;
  let a = Math.abs(parentX - childX);
  let b = Math.abs(parentY - childY);
  let c = Math.sqrt(a * a + b * b);
  ctx.beginPath();
  let startX = isLeftChild ? parent.pX - a / c * 25 : parent.pX + a / c * 25;
  console.log('startX: ', startX);
  let startY = parent.pY + b / c * 25;
  console.log('startY: ', startY);
  let endX = isLeftChild ? child.pX + a / c * 25 : child.pX - a / c * 25;
  console.log('endX: ', endX);
  let endY = child.pY - b / c * 25;
  console.log('endY: ', endY);
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
}