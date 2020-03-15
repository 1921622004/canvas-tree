import TreeNode from "./treeNode"
import { performWorkAtNode, ReturnFlag, drawLineBetweenNodes } from "./utils";

class RedBlackTree {
  private root: TreeNode = null;
  private startPX = 250;
  private startPY = 25;
  constructor(private ctx: CanvasRenderingContext2D) {
  }

  add = (val: number): void => {
    let level = 0;
    performWorkAtNode(this.root, [(node, arg: TreeNode) => {
      if (!node) {
        let newNode: TreeNode;
        if (!arg) {
          newNode = new TreeNode(this.ctx, val, this.startPX, this.startPY);
          this.root = newNode;
        } else {
          let parent = arg;
          newNode = new TreeNode(this.ctx, val);
          newNode.parent = parent;
          console.log(level);

          let cos = Math.cos((10 + level * 20) / 180 * Math.PI);
          let sin = Math.sin((10 + level * 20) / 180 * Math.PI);
          console.log(cos, sin);
          
          if (parent.val > val) {
            parent.left = newNode;
            newNode.pX = parent.pX - cos * 160;
            newNode.pY = parent.pY + sin * 120;
            drawLineBetweenNodes(arg, newNode, this.ctx);
          } else {
            parent.right = newNode;
            newNode.pX = parent.pX + cos * 160;
            newNode.pY = parent.pY + sin * 120;
            drawLineBetweenNodes(arg, newNode, this.ctx);
          }
        }
        newNode.drawNode();
        return {
          node: newNode,
          flag: ReturnFlag.NEXT_LOOP
        }
      };
      if (node.val > val) {
        level++;
        return {
          node: node.left,
          flag: ReturnFlag.CONTINUE_LOOP,
          res: node
        }
      } else if (node.val < val) {
        level++;
        return {
          node: node.right,
          flag: ReturnFlag.CONTINUE_LOOP,
          res: node
        }
      } else {
        return {
          node: this.root,
          flag: ReturnFlag.FINISH
        }
      }
    }, (node) => {

    }], this.root);
    // let t = this.root;
    // let p = null;
    // while (t) {
    //   p = t;
    //   if (t.val < val) {
    //     t = t.right;
    //   } else if (t.val > val) {
    //     t = t.left;
    //   } else return;
    // }
    // let node = new TreeNode(this.ctx, val);
    // node.parent = p;
    // if (p === null) {
    //   this.root = node;
    // } else if (p.val < node.val) {
    //   p.right = node;
    // } else {
    //   p.left = node;
    // }
  }

  find = (val: number): boolean => {
    return true
  }

  remove = (val: number): void => {

  }
}

export default RedBlackTree