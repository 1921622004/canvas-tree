import RedBlackTree from "./tree";

let canvas = document.createElement('canvas');
canvas.height = 1000;
canvas.width = 1080;
document.body.appendChild(canvas);
let ctx = canvas.getContext('2d');
let rbTree = new RedBlackTree(ctx);

(function () {
  let addInput: HTMLInputElement = document.querySelector('#add-input');
  let addBtn = document.querySelector('#add-btn');
  let removeInput: HTMLInputElement = document.querySelector('#remove-input');
  let removeBtn = document.querySelector('#remove-btn');
  addBtn.addEventListener('click', () => {
    let inputVal = addInput.value;
    if (!inputVal || !inputVal.trim()) return;
    let num = parseInt(inputVal);
    if (isNaN(num)) return;
    rbTree.add(num);
  })
  removeBtn.addEventListener('click', () => {
    let removeVal = removeInput.value;
    if (!removeVal || !removeVal.trim()) return;
    let num = parseInt(removeVal);
    if (isNaN(num)) return;
  })
})()