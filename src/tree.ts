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
    let eles = this.getAllEleByDir(node, 'left');
    let leftChildPos = this.getChildPosByParent(node, 'left');
    let diffX = node.position[0] - leftChildPos[0];
    let diffY = node.position[1] - leftChildPos[1];
    
    eles.forEach((item) => {
      if (item instanceof TreeNode) {
        let { position } = item;
        item.level--;
        item.translatePosition([position[0] + diffX, position[1] + diffY])
      }
      if (item instanceof Polyline) {
        let points = item.getAttribute('points');
        item.transition(0.1).attr({
          points: [points[0] + diffX, points[1] + diffY, points[2] + diffX, points[3] + diffY]
        })
      }
    });
    node.rightLine.remove();
    if (rightNodeLeft) {
      let rightNodeLeftEles = this.getAllEleByDir(rightNodeLeft, 'all');
      let rightNodeLeftNewPos = this.getChildPosByParent(node, 'right');
      let rnlDiffX = rightNodeLeft.position[0] - rightNodeLeftNewPos[0];
      let rnlDiffY = rightNodeLeft.position[1] - rightNodeLeftNewPos[1];
      rightNodeLeftEles.forEach((item) => {
        if (item instanceof TreeNode) {
          let { position } = item;
          item.translatePosition([position[0] - rnlDiffX, position[1] - rnlDiffY]);
        }
        if (item instanceof Polyline) {
          let points = item.getAttribute('points');
          item.transition(0.1).attr({
            points: [points[0] - rnlDiffX, points[1] - rnlDiffY, points[2] - rnlDiffX, points[3] - rnlDiffY]
          })
        }
      });
      drawLineBetweenNodes(node, rightNodeLeft, this.layer);
    }
    let rightNodeEles = this.getAllEleByDir(rightNode, 'all');
    rightNodeEles.forEach((item) => {
      if (item instanceof TreeNode) {
        let { position } = item;
        item.level++;
        item.translatePosition([position[0] - diffX, position[1] - diffY])
      }
      if (item instanceof Polyline) {
        let points = item.getAttribute('points');
        item.transition(0.1).attr({
          points: [points[0] - diffX, points[1] - diffY, points[2] - diffX, points[3] - diffY]
        })
      }
    });
    drawLineBetweenNodes(rightNode, node, this.layer);
    rightNode.leftLine.remove();
    node.right = rightNodeLeft;
    if (rightNodeLeft) rightNodeLeft.parent = node;
    rightNode.left = node;
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
    let eles = this.getAllEleByDir(node, 'right');
    let rightChildPos = this.getChildPosByParent(node, 'right');
    let diffX = node.position[0] - rightChildPos[0]; // fu
    let diffY = node.position[1] - rightChildPos[1]; // fu
    eles.forEach((item) => {
      if (item instanceof TreeNode) {
        let { position } = item;
        item.level--;
        item.translatePosition([position[0] + diffX, position[1] + diffY])
      }
      if (item instanceof Polyline) {
        let points = item.getAttribute('points');
        item.transition(0.1).attr({
          points: [points[0] + diffX, points[1] + diffY, points[2] + diffX, points[3] + diffY]
        })
      }
    });
    node.leftLine.remove();
    if (leftNodeRight) {
      let leftNodeRightEles = this.getAllEleByDir(leftNodeRight, 'all');
      let leftNodeRightNewPos = this.getChildPosByParent(node, 'left');
      let rnlDiffX = leftNodeRight.position[0] - leftNodeRightNewPos[0];
      let rnlDiffY = leftNodeRight.position[1] - leftNodeRightNewPos[1];
      leftNodeRightEles.forEach((item) => {
        if (item instanceof TreeNode) {
          let { position } = item;
          item.translatePosition([position[0] - rnlDiffX, position[1] - rnlDiffY]);
        }
        if (item instanceof Polyline) {
          let points = item.getAttribute('points');
          item.transition(0.1).attr({
            points: [points[0] - rnlDiffX, points[1] - rnlDiffY, points[2] - rnlDiffX, points[3] - rnlDiffY]
          })
        }
      });
      drawLineBetweenNodes(node, leftNodeRight, this.layer);
    }
    let rightNodeEles = this.getAllEleByDir(leftNode, 'all');
    rightNodeEles.forEach((item) => {
      if (item instanceof TreeNode) {
        let { position } = item;
        item.level++;
        item.translatePosition([position[0] - diffX, position[1] - diffY])
      }
      if (item instanceof Polyline) {
        let points = item.getAttribute('points');
        item.transition(0.1).attr({
          points: [points[0] - diffX, points[1] - diffY, points[2] - diffX, points[3] - diffY]
        })
      }
    });
    drawLineBetweenNodes(leftNode, node, this.layer);
    leftNode.rightLine.remove();
    node.left = leftNodeRight;
    if (leftNodeRight) leftNodeRight.parent = node;
    leftNode.right = node;
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
}

export default RedBlackTree