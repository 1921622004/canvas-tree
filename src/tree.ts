import TreeNode from "./treeNode"
import { performWorkAtNode, ReturnFlag, drawLineBetweenNodes } from "./utils";
import { Scene, Layer, Polyline } from "spritejs";

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
    }, (node) => {
      console.log(node);
      return {
        node: node,
        flag: ReturnFlag.FINISH
      }
    }], this.root);
  }

  find = (val: number): boolean => {
    return true
  }

  remove = (val: number): void => {

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
    let eles = this.getAllEleByDir(node, 'left');
    let leftChildPos = this.getChildPosByParent(node, 'left');
    let diffX = node.position[0] - leftChildPos[0];
    let diffY = node.position[1] - leftChildPos[1];
    eles.forEach((item) => {
      if (item instanceof TreeNode) {
        let { position } = item;
        item.translatePosition([position[0] - diffX, position[1] - diffY])
      }
      if (item instanceof Polyline) {
        let points = item.getAttribute('points');
        item.transition(0.1).attr({
          points: [points[0] - diffX, points[1] - diffY, points[2] - diffX, points[3] - diffY]
        })
      }
    })
    let rightNode = node.right;
    let rightNodeLeft = rightNode.left;
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

  getAllEleByDir = (node: TreeNode, dir: 'left' | 'right'): (TreeNode | Polyline)[] => {
    let eles: any[] = [node];
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
    if (dir === 'left') {
      eles.push(node.leftLine);
      mapper(node.left);
    } else {
      eles.push(node.rightLine);
      mapper(node.right);
    }
    return eles
  }
}

export default RedBlackTree