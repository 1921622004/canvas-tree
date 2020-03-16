import { TreeNodeColor } from "./constants";
import { Arc, Polyline, Layer, Label } from "spritejs";

class TreeNode {
  public parent: TreeNode = null;
  public left: TreeNode = null;
  public right: TreeNode = null;
  public leftLine: Polyline = null;
  public rightLine: Polyline = null;
  private textEle: Label;
  private _val: number;
  public readonly ele: Arc;
  constructor(
    val: number
  ) {
    this._val = val;
    this.ele = new Arc({
      pos: [0, 0],
      radius: 25,
      startAngle: 0,
      endAngle: 360
    });
    this.textEle = new Label(val + '');
    this.textEle.attr({
      pos: [0, 0],
      textAlign: 'center',
      lineHeight: 50,
      fillColor: '#fff',
      width: 50,
      height: 50
    })
    this.color = TreeNodeColor.Red;
  }

  public get position(): [number, number] {
    return this.ele.getAttribute('pos');
  }

  public set position(pos: [number, number]) {
    this.ele.setAttribute('pos', pos);
    this.textEle.setAttribute('pos', [pos[0] - 25, pos[1] - 25]);
  }

  public get color(): TreeNodeColor {
    return this.ele.getAttribute('fillColor');
  }

  public set color(color: TreeNodeColor) {
    this.ele.setAttribute('fillColor', color);
  }

  public set val(val: number) {
    this._val = val;
    this.textEle.attr('text', val + '');
  }

  public get val(): number {
    return this._val
  }

  public drawNode(layer: Layer) {
    layer.append(this.ele, this.textEle);
  }
}

export default TreeNode