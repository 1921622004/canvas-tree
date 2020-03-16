import TreeNode from "./treeNode"
import { performWorkAtNode, ReturnFlag, drawLineBetweenNodes } from "./utils";
import { Scene, Layer } from "spritejs";

class RedBlackTree {
  private root: TreeNode = null;
  private startPX = 600;
  private startPY = 25;
  constructor(private layer: Layer) {
  }

  add = (val: number): void => {
    let level = 0;
    performWorkAtNode(this.root, [(node, arg: TreeNode) => {
      if (!node) {
        let newNode: TreeNode;
        if (!arg) {
          newNode = new TreeNode(val);
          newNode.position = [this.startPX, this.startPY];
          this.root = newNode;
        } else {
          let parent = arg;
          newNode = new TreeNode(val);
          newNode.parent = parent;
          console.log(level);

          let cos = Math.cos((10 + level * 20) / 180 * Math.PI);
          let sin = Math.sin((10 + level * 20) / 180 * Math.PI);
          console.log(cos, sin);
          const [parentPX, parentPY] = parent.position;
          let childPX, childPY;
          if (parent.val > val) {
            parent.left = newNode;
            childPX = parentPX - cos * 160;
            childPY = parentPY + sin * 120;
          } else {
            parent.right = newNode;
            childPX = parentPX + cos * 160;
            childPY = parentPY + sin * 120;
          }
          newNode.position = [childPX, childPY];
          drawLineBetweenNodes(arg, newNode, this.layer);
        }
        console.log(newNode);
        
        newNode.drawNode(this.layer);
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