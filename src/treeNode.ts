import { TreeNodeColor } from "./constants";

class TreeNode {
  public parent: TreeNode = null;
  public left: TreeNode = null;
  public right: TreeNode = null;
  public color = TreeNodeColor.Red;
  constructor(private ctx: CanvasRenderingContext2D, private val: number) {}
}

export default TreeNode