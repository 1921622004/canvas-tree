import TreeNode from "./treeNode"
import { performWorkAtNode, ReturnFlag, drawLineBetweenNodes } from "./utils";
import { Scene, Layer, Polyline } from "spritejs";
import { TreeNodeColor } from "./constants";

class RedBlackTree {
  private root: TreeNode = null;
  private startPX = 600;
  private startPY = 25;
  constructor(private layer: Layer) {
  }

  add = (val: number): void => {
    performWorkAtNode(this.root, [(node, arg: TreeNode) => {
      if (!node) {
        let newNode: TreeNode;
        if (!arg) {
          newNode = new TreeNode(val, 1);
          newNode.position = [this.startPX, this.startPY];
          this.root = newNode;
        } else {
          let parent = arg;
          newNode = new TreeNode(val, parent.level + 1);
          newNode.parent = parent;
          if (parent.val > val) {
            parent.left = newNode;
            newNode.position = this.getChildPosByParent(parent, 'left')
          } else {
            parent.right = newNode;
            newNode.position = this.getChildPosByParent(parent, 'right');
          }
          drawLineBetweenNodes(arg, newNode, this.layer);
        }
        newNode.drawNode(this.layer);
        return {
          node: newNode,
          flag: ReturnFlag.NEXT_LOOP
        }
      };
      if (node.val > val) {
        return {
          node: node.left,
          flag: ReturnFlag.CONTINUE_LOOP,
          res: node
        }
      } else if (node.val < val) {
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
    }, this.insertFixWorkLoop], this.root);
  }

  find = (val: number): boolean => {
    return true
  }

  remove = (val: number): void => {

  }

  insertFixWorkLoop = (node: TreeNode) => {
    if (node === this.root) {
      node.color = TreeNodeColor.Black
      return {
        node: node,
        flag: ReturnFlag.FINISH
      }
    } else if (node.parent.color === TreeNodeColor.Black) {
      return {
        node: node,
        flag: ReturnFlag.FINISH
      }
    } else {
      let parentNode = node.parent;
      if (node.parent === parentNode.parent.left) {
        let uncleNode = parentNode.parent.right;
        if (uncleNode && uncleNode.color === TreeNodeColor.Red) {
          node.parent.color = TreeNodeColor.Black;
          uncleNode.color = TreeNodeColor.Black;
          node.parent.parent.color = TreeNodeColor.Red;
          node = node.parent.parent;
        } else if (node === node.parent.right) {
          node = node.parent;
          this.rotateLeft(node);
        } else {
          node.parent.color = TreeNodeColor.Black;
          node.parent.parent.color = TreeNodeColor.Red;
          this.rotateRight(node.parent.parent);
        }
      } else {
        let uncleNode = parentNode.parent.left;
        if (uncleNode && uncleNode.color === TreeNodeColor.Red) {
          parentNode.color = TreeNodeColor.Black;
          uncleNode.color = TreeNodeColor.Black;
          parentNode.parent.color = TreeNodeColor.Red;
          node = node.parent.parent;
        } else if (node === node.parent.left) {
          node = node.parent;
          this.rotateRight(node);
        } else {
          node.parent.color = TreeNodeColor.Black;
          node.parent.parent.color = TreeNodeColor.Red;
          this.rotateLeft(node.parent.parent);
        }
      }
      return {
        node: node,
        flag: ReturnFlag.CONTINUE_LOOP
      }
    }

  }

  getChildPosByParent = (parent: TreeNode, dir: 'left' | 'right'): [number, number] => {
    let level = parent.level;
    let cos = Math.cos((10 + level * 20) / 180 * Math.PI);
    let sin = Math.sin((10 + level * 20) / 180 * Math.PI);
    const [parentPX, parentPY] = parent.position;
    if (dir === 'left') {
      return [parentPX - cos * 160, parentPY + sin * 120];
    } else {
      return [parentPX + cos * 120, parentPY + sin * 120];
    }
  }

  rotateLeft = (node: TreeNode): TreeNode => {
    let rightNode = node.right;
    let rightNodeLeft = rightNode.left;
    let oldNodePostion = node.position;
    node.rightLine.remove();
    node.right = rightNodeLeft;
    let leftChildPos = this.getChildPosByParent(node, 'left');
    this.moveAllNode(node, leftChildPos, 'down', false);
    if (rightNodeLeft) {
      rightNode.left = null;
      rightNode.leftLine.remove();
      rightNodeLeft.parent = node;
    }
    this.moveAllNode(rightNode, oldNodePostion, 'up', false);
    rightNode.left = node;
    drawLineBetweenNodes(rightNode, node, this.layer);
    if (node.parent) {
      if (node.parent.left === node) {
        node.parent.left = rightNode;
      } else {
        node.parent.right = rightNode;
      }
      rightNode.parent = node.parent;
    } else {
      this.root = rightNode;
      rightNode.parent = null;
    }
    node.parent = rightNode;
    return rightNode
  }

  rotateRight = (node: TreeNode): TreeNode => {
    let leftNode = node.left;
    let leftNodeRight = leftNode.right;
    let oldNodePostion = node.position;
    node.leftLine.remove();
    node.left = leftNodeRight;
    let rightNodePos = this.getChildPosByParent(node, 'right');
    this.moveAllNode(node, rightNodePos, 'down', false);
    if (leftNodeRight) {
      leftNode.right = null;
      leftNode.leftLine.remove();
      leftNodeRight.parent = node;
    }
    this.moveAllNode(leftNode, oldNodePostion, 'up', false);
    leftNode.right = node;
    drawLineBetweenNodes(leftNode, node, this.layer);
    if (node.parent) {
      if (node.parent.left === node) {
        node.parent.left = leftNode;
      } else {
        node.parent.right = leftNode;
      }
      leftNode.parent = node.parent;
    } else {
      this.root = leftNode;
      leftNode.parent = null;
    }
    node.parent = leftNode;
    return leftNode
  }

  getAllEleByDir = (node: TreeNode, dir: 'left' | 'right' | 'all'): (TreeNode | Polyline)[] => {
    let eles: any[] = [];
    node && eles.push(node);
    const mapper = (node: TreeNode) => {
      eles.push(node);
      if (!node.left && !node.right) return
      if (node.left) {
        eles.push(node.leftLine);
        mapper(node.left)
      }
      if (node.right) {
        eles.push(node.rightLine);
        mapper(node.right);
      }
    }
    if (dir === 'left' && node.left) {
      eles.push(node.leftLine);
      mapper(node.left);
    } else if (dir === 'right' && node.right) {
      eles.push(node.rightLine);
      mapper(node.right);
    } else {
      if (node.left) {
        eles.push(node.leftLine);
        mapper(node.left);
      }
      if (node.right) {
        eles.push(node.rightLine);
        mapper(node.right);
      }
    }
    return eles
  }

  moveAllNode = (node: TreeNode, pos: [number, number], dir: 'up' | 'down', needDrawLine: boolean) => {
    if (!node) return;
    if (dir === 'up') {
      node.level--;
    } else {
      node.level++;
    }
    node.position = pos;
    needDrawLine && drawLineBetweenNodes(node.parent, node, this.layer);
    node.left && this.moveAllNode(node.left, this.getChildPosByParent(node, 'left'), dir, true);
    node.right && this.moveAllNode(node.right, this.getChildPosByParent(node, 'right'), dir, true);
  }
}

export default RedBlackTree