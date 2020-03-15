import { TreeNodeColor } from "./constants";

class TreeNode {
  public parent: TreeNode = null;
  public left: TreeNode = null;
  public right: TreeNode = null;
  public color = TreeNodeColor.Red;
  constructor(
    private ctx: CanvasRenderingContext2D, 
    public val: number, 
    public pX: number = 0, 
    public pY: number = 0
  ) {}

  public drawNode() {
    this.ctx.arc(this.pX, this.pY, 25, 0, 360);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(this.val + '', this.pX, this.pY);
  }
}

export default TreeNode