import { Scene } from "spritejs";
import RedBlackTree from "./tree";


let container = document.querySelector('#stage');
const scene = new Scene({
  container,
  width: 1200,
  height: 1000,
  mode: 'stickyTop'
});
console.log(scene);

let rbTree = new RedBlackTree(scene.layer());

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