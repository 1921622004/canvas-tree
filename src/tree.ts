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
    }, this.insertFixWorkLoop], this.root, this.layer);
  }

  find = (val: number): boolean => {
    return true
  }

  remove = async (val: number) => {
    let nodeRef: TreeNode;
    performWorkAtNode(this.root, [async (node, target) => {
      if (!node) {
        return {
          node: this.root,
          flag: ReturnFlag.FINISH
        }
      } else {
        if (node.val > target) {
          return {
            node: node.left,
            res: target,
            flag: ReturnFlag.CONTINUE_LOOP
          }
        } else if (node.val < target) {
          return {
            node: node.right,
            res: target,
            flag: ReturnFlag.CONTINUE_LOOP
          }
        } else {
          return {
            node,
            flag: ReturnFlag.NEXT_LOOP,
            res: target
          }
        }
      }
    }, async (node, target) => {
      if (!node.right) {
        return {
          flag: ReturnFlag.NEXT_LOOP,
          node
        }
      } else {
        const minNode = await this.findMin(node.right);
        node.val = minNode.val;
        return {
          flag: ReturnFlag.PREV_LOOP,
          node: node.right,
          res: minNode.val
        }
      }
    }, async (node, arg) => {
      if (node.color === TreeNodeColor.Red) {
        this.removeNode(node);
        return {
          node: this.root,
          flag: ReturnFlag.FINISH
        }
      } else {
        return {
          node,
          flag: ReturnFlag.NEXT_LOOP
        }
      }
    }, async (node, arg) => {
      !nodeRef && (nodeRef = node);
      if (node === this.root || node.color === TreeNodeColor.Red) {
        return {
          node,
          flag: ReturnFlag.NEXT_LOOP
        }
      } else {
        if (node.parent.left === node) {
          let brotherNode = node.parent.right;
          if (brotherNode.color === TreeNodeColor.Red) {
            brotherNode.color = TreeNodeColor.Black;
            node.color = TreeNodeColor.Black;
            node.parent.color = TreeNodeColor.Red;
            await this.rotateLeft(node.parent);
            return {
              node,
              flag: ReturnFlag.CONTINUE_LOOP
            }
          } else if (
            (!brotherNode.left || brotherNode.left.color === TreeNodeColor.Black)
            &&
            (!brotherNode.right || brotherNode.right.color === TreeNodeColor.Black)
          ) {
            if (node.parent.color === TreeNodeColor.Red) {
              brotherNode.color = TreeNodeColor.Red;
              node.parent.color = TreeNodeColor.Black;
              debugger
              return {
                node,
                flag: ReturnFlag.NEXT_LOOP
              }
            } else {
              brotherNode.color = TreeNodeColor.Red;
              return {
                node: node.parent,
                flag: ReturnFlag.CONTINUE_LOOP
              }
            }
          } else if (
            (brotherNode.left && brotherNode.left.color === TreeNodeColor.Red)
            &&
            (!brotherNode.right || brotherNode.right.color === TreeNodeColor.Black)
          ) {
            await this.rotateRight(brotherNode);
            brotherNode.color = TreeNodeColor.Red;
            brotherNode.parent.color = TreeNodeColor.Black;
            return {
              node,
              flag: ReturnFlag.CONTINUE_LOOP
            }
          } else if (brotherNode.right.color === TreeNodeColor.Red) {
            brotherNode.color = node.parent.color;
            node.parent.color = TreeNodeColor.Black;
            brotherNode.right.color = TreeNodeColor.Black;
            await this.rotateLeft(node.parent);
            return {
              node,
              flag: ReturnFlag.NEXT_LOOP
            }
          }
        } else {
          let brotherNode = node.parent.left;
          if (brotherNode.color === TreeNodeColor.Red) {
            brotherNode.color = TreeNodeColor.Black;
            node.color = TreeNodeColor.Black;
            node.parent.color = TreeNodeColor.Red;
            await this.rotateRight(node.parent);
            return {
              node,
              flag: ReturnFlag.CONTINUE_LOOP
            }
          } else if (
            (!brotherNode.left || brotherNode.left.color === TreeNodeColor.Black)
            &&
            (!brotherNode.right || brotherNode.right.color === TreeNodeColor.Black)
          ) {
            if (node.parent.color === TreeNodeColor.Red) {
              brotherNode.color = TreeNodeColor.Red;
              node.parent.color = TreeNodeColor.Black;
              debugger
              return {
                node,
                flag: ReturnFlag.NEXT_LOOP
              }
            } else {
              brotherNode.color = TreeNodeColor.Red;
              return {
                node: node.parent,
                flag: ReturnFlag.CONTINUE_LOOP
              }
            }
          } else if (
            (brotherNode.right && brotherNode.right.color === TreeNodeColor.Red) 
            && 
            (!brotherNode.left || brotherNode.left.color === TreeNodeColor.Black)
          ) {
            await this.rotateLeft(brotherNode);
            brotherNode.color = TreeNodeColor.Red;
            brotherNode.parent.color = TreeNodeColor.Black;
            return {
              node,
              flag: ReturnFlag.CONTINUE_LOOP
            }
          } else if (brotherNode.left.color === TreeNodeColor.Red) {
            brotherNode.color = node.parent.color;
            node.parent.color = TreeNodeColor.Black;
            brotherNode.left.color = TreeNodeColor.Black;
            await this.rotateRight(node.parent);
            return {
              node,
              flag: ReturnFlag.NEXT_LOOP
            }
          }
        }
      }
    }, async (node) => {
      node.color = TreeNodeColor.Black;
      this.removeNode(nodeRef);
      return {
        node: this.root,
        flag: ReturnFlag.FINISH
      }
    }], val, this.layer);
  }

  insertFixWorkLoop = async (node: TreeNode) => {
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
          await this.rotateLeft(node);
        } else {
          node.parent.color = TreeNodeColor.Black;
          node.parent.parent.color = TreeNodeColor.Red;
          await this.rotateRight(node.parent.parent);
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
          await this.rotateRight(node);
        } else {
          node.parent.color = TreeNodeColor.Black;
          node.parent.parent.color = TreeNodeColor.Red;
          await this.rotateLeft(node.parent.parent);
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
      return [parentPX - (200 - level * 30), parentPY + 80];
    } else {
      return [parentPX + (200 - level * 30), parentPY + 80];
    }
  }

  rotateLeft = async (node: TreeNode): Promise<TreeNode> => {
    let rightNode = node.right;
    let rightNodeLeft = rightNode.left;
    let oldNodePostion = node.position;
    node.rightLine.remove();
    node.right = rightNodeLeft;
    let leftChildPos = this.getChildPosByParent(node, 'left');
    await this.moveAllNode(node, leftChildPos, 'down', false);
    if (rightNodeLeft) {
      rightNode.left = null;
      rightNode.leftLine.remove();
      rightNodeLeft.parent = node;
      drawLineBetweenNodes(node, rightNodeLeft, this.layer);
    }
    await this.moveAllNode(rightNode, oldNodePostion, 'up', false);
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

  rotateRight = async (node: TreeNode): Promise<TreeNode> => {
    let leftNode = node.left;
    let leftNodeRight = leftNode.right;
    let oldNodePostion = node.position;
    node.leftLine.remove();
    node.left = leftNodeRight;
    let rightNodePos = this.getChildPosByParent(node, 'right');
    await this.moveAllNode(node, rightNodePos, 'down', false);
    if (leftNodeRight) {
      leftNode.right = null;
      leftNode.leftLine.remove();
      leftNodeRight.parent = node;
      drawLineBetweenNodes(node, leftNodeRight, this.layer);
    }
    await this.moveAllNode(leftNode, oldNodePostion, 'up', false);
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

  moveAllNode = async (node: TreeNode, pos: [number, number], dir: 'up' | 'down', needDrawLine: boolean) => {
    if (!node) return;
    if (dir === 'up') {
      node.level--;
    } else {
      node.level++;
    }
    await node.changePos(pos);
    needDrawLine && drawLineBetweenNodes(node.parent, node, this.layer);
    node.left && this.moveAllNode(node.left, this.getChildPosByParent(node, 'left'), dir, true);
    node.right && this.moveAllNode(node.right, this.getChildPosByParent(node, 'right'), dir, true);
  }

  removeNode = async (node: TreeNode) => {
    if (node === this.root) {
      if (node.left) {
        this.root = node.left;
        await this.moveAllNode(this.root, [this.startPX, this.startPY], 'up', false);
        node.parent = null;
      } else if (node.right) {
        this.root = node.right;
        await this.moveAllNode(this.root, [this.startPX, this.startPY], 'up', false);
        node.parent = null;
      } else {
        this.root = null;
      }
    } else {
      let nodePos = node.position;
      if (node.parent.left === node) {
        if (node.left) {
          node.parent.left = node.left;
          node.left.parent = node.parent;
          node.leftLine.remove();
          await this.moveAllNode(node.left, nodePos, 'up', false);
        } else if (node.right) {
          node.parent.left = node.right;
          node.right.parent = node.parent;
          node.rightLine.remove();
          await this.moveAllNode(node.right, nodePos, 'up', false);
        } else {
          node.parent.leftLine.remove();
          node.parent.left = null;
        }
      } else {
        if (node.left) {
          node.parent.right = node.left;
          node.left.parent = node.parent;
          node.leftLine.remove();
          await this.moveAllNode(node.left, nodePos, 'up', false);
        } else if (node.right) {
          node.parent.right = node.right;
          node.right.parent = node.parent;
          node.rightLine.remove();
          await this.moveAllNode(node.right, nodePos, 'up', false);
        } else {
          node.parent.rightLine.remove();
          node.parent.right = null;
        }
      }
    }
    node.delete();
  }

  findMin = async (_node: TreeNode): Promise<TreeNode> => {
    let res;
    await performWorkAtNode(_node, [async (node) => {
      if (node.left) {
        return {
          node: node.left,
          flag: ReturnFlag.CONTINUE_LOOP
        }
      } else {
        res = node;
        return {
          node,
          flag: ReturnFlag.FINISH
        }
      }
    }], null, this.layer);
    return res;
  }
}

export default RedBlackTree