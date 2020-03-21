import { Scene, Polyline } from "spritejs";
import RedBlackTree from "./tree";


let container = document.querySelector('#stage');
const scene = new Scene({
  container,
  width: 1200,
  height: 1000,
  mode: 'stickyTop'
});
console.log(scene);

let layer = scene.layer();
let rbTree = new RedBlackTree(layer);
// rbTree.add(12);
// rbTree.add(7);
// rbTree.add(19);
// rbTree.add(13);
// rbTree.add(23);

;(function () {
  let addInput: HTMLInputElement = document.querySelector('#add-input');
  let addBtn = document.querySelector('#add-btn');
  let removeInput: HTMLInputElement = document.querySelector('#remove-input');
  let removeBtn = document.querySelector('#remove-btn');
  let addHandler = () => {
    let inputVal = addInput.value;
    if (!inputVal || !inputVal.trim()) return;
    let num = parseInt(inputVal);
    if (isNaN(num)) return;
    rbTree.add(num);
    addInput.value = '';
  }
  addBtn.addEventListener('click', addHandler);
  addInput.addEventListener('keydown', (ev) => {
    if (ev.keyCode === 13) {
      addHandler();
    }
  })
  let removeHandler = () => {
    let removeVal = removeInput.value;
    if (!removeVal || !removeVal.trim()) return;
    let num = parseInt(removeVal);
    if (isNaN(num)) return;
    rbTree.remove(num);
    removeInput.value = '';
  }
  removeBtn.addEventListener('click', removeHandler);
  removeInput.addEventListener('keydown', (ev) => {
    if (ev.keyCode === 13) {
      removeHandler();
    }
  })
})()