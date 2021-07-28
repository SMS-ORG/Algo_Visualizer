import {
  drawBars,
  sort,
  makeReady,
  obtainMousePosition,
  Utils,
} from "./canvas.js";
var toggler = "bubblesort";
var mousedownID = -1;
const drawmode = [0x001, 0x002, 0x004, 0x008]; //lookuptable [newstart, newend, removemode, insertmode]

const HTML = [
  "<h1>Algo Visualizer</h1>" +
  "<hr>" +
  "<p>Algo-Visualizer is intended to be a graphical visualizer of how sorting algorithms do<br>" +
  "sort the data structure and data structures handle the data in an order.The main aim of<br>" +
  "the algo visualizer is to present learners with a visual way to understand the way most<br>" +
  "common algorithm works and how different approaches can yield different results in<br>" +
  "different condition.<br>" +
  "<br>" +
  "Algo-Visualizer is intended to help novice programmers understand the intricacies of<br>" +
  "sorting and pathfinding algorithms. This applet will be written in JavaScript with an<br>" +
  "aim to popularize a visualization method as a pedagogical tool to teach/learn algorithms.</p><br>",
]; // look up tables 

let introduce = document.getElementById("intro");
let introduction = document.getElementById("introduction");

const changeCanvasSize = function () {
  let slider = document.getElementById("myRange");
  let width = 800;
  let height = 500;
  if (window.innerWidth > 1000) {
    width = 800;
    Utils.Sorting.width = 8;
    Utils.Sorting.space = 4;
    slider.setAttribute('max', 65);
    slider.setAttribute('value', 30);
    slider.setAttribute('value', 5);
  } else {
    width = 475;
    Utils.Sorting.width = 4;
    Utils.Sorting.space = 2;
    slider.setAttribute('max', 35);
    slider.setAttribute('value', 20);
    slider.setAttribute('min', 15);
  }
  document.querySelectorAll("canvas").forEach(element => {
    element.width = width;
    element.height = height;
  });
}

const changeActive = (_tog, pos = 0) => {
  document.getElementById(toggler).classList.toggle("active");
  toggler = _tog;
  document.getElementById(toggler).classList.toggle("active");
  introduction.innerHTML = HTML[pos];
};

//switch radio buttons
function checkRadio(event) {
  Utils.Drawmodes = drawmode[this.value - 1];
}

function mousedown(event) {
  obtainMousePosition(event);
  if (mousedownID == -1) {
    //Prevent multiple loops!
    mousedownID = setInterval(() => {
      let element = document.getElementById("CANVAS");
      element.onmousemove = obtainMousePosition;
      //    element.onmousedown=obtainMousePosition;
    }, 100); /*execute every 100ms*/
  }
}

function mouseup(event) {
  if (mousedownID != -1) {
    //Only stop if exists
    clearInterval(mousedownID);
    let element = document.getElementById("CANVAS");
    element.onmousemove = null;
    mousedownID = -1;
  }
}

const BubbleSort = () => {
  makeReady(1, [mousedown, mouseup]);
  changeActive("bubblesort",0);
}; //function for bubblesort

const HeapSort = () => {
  makeReady(1, [mousedown, mouseup]);
  changeActive("heapsort",1);
}; //function for Heapsort

const QuickSort = () => {
  makeReady(1, [mousedown, mouseup]);
  changeActive("quicksort",2);
  //function for quicksort
};
const MergeSort = () => {
  makeReady(1, [mousedown, mouseup]);
  changeActive("mergesort",3);
}; //function for MergeSort

const PathFind = () => {
  makeReady(2, [mousedown, mouseup]);
  changeActive("pathfind",4);
}; //function for Path Finding Algorithm

const Linkedlist = () => {
  makeReady(3, [mousedown, mouseup]);
  changeActive("linkedlist",5);
}; //function for Linked List

const Bst = () => {
  makeReady(3, [mousedown, mouseup]);
  changeActive("bst",6); 
  //function for Bst
};

function Sortingmethod() {
  if (toggler) {
    sort(toggler);
  } else {
    alert("Select A Method First");
  }
}

(function (window, document, undefined) {
  // code that should be taken care of right away
  window.onload = init;

  function init() {
    let slider = document.getElementById("myRange");

    // the code to be called when the dom has loaded

    //Event Listeners For ID's
    document
      .getElementById("bubblesort")
      .addEventListener("click", BubbleSort, false);
    document
      .getElementById("quicksort")
      .addEventListener("click", QuickSort, false);
    document
      .getElementById("heapsort")
      .addEventListener("click", HeapSort, false);
    document
      .getElementById("mergesort")
      .addEventListener("click", MergeSort, false);
    document
      .getElementById("pathfind")
      .addEventListener("click", PathFind, false);
    document.getElementById("bst").addEventListener("click", Bst, false);
    document
      .getElementById("linkedlist")
      .addEventListener("click", Linkedlist, false);

    window.addEventListener('resize', changeCanvasSize);
    changeCanvasSize();

    document.getElementById("insert").addEventListener("click", checkRadio);
    document.getElementById("deleteNode").addEventListener("click", checkRadio);
    document.getElementById("insertEnd").addEventListener("click", checkRadio);
    document.getElementById("insertStart").addEventListener("click", checkRadio);


    //Main PlayPause Slider
    document.getElementById("playPause").addEventListener("click", () => {
      var playPause = document.getElementById("playPause");
      if (!Utils.AnimationController.playing) {
        Utils.AnimationController.cancelAnimation();
        Utils.AnimationController.playing = true;
        Utils.AnimationController.queueIncrement = 1;
        Utils.AnimationController.frameRate = Utils.AnimationController.recentFrameRate;
        playPause.classList.toggle("paused");
        Sortingmethod();
      }
      if (playPause.classList.length == 1) {
        Utils.AnimationController.recentFrameRate =
          Utils.AnimationController.frameRate;
        Utils.AnimationController.frameRate = 100000;
        playPause.classList.toggle("paused");
      } else {
        Utils.AnimationController.frameRate =
          Utils.AnimationController.recentFrameRate;
        playPause.classList.toggle("paused");
      }
    });

    //rewind and forward buttons
    document.getElementById("arrow-right").addEventListener("click",
      () => {
        if (Utils.AnimationController.queueIncrement < 0) {
          Utils.AnimationController.preventIncrement = true;
        }
        Utils.AnimationController.queueIncrement = 1;
      }
    );

    document.getElementById("arrow-left").addEventListener("click",
      () => {
        if (Utils.AnimationController.queueIncrement > 0) {
          Utils.AnimationController.preventIncrement = true;
        }
        Utils.AnimationController.queueIncrement = -1;
      }
    );

    //Radio Buttons for posistioning start, end ... for A* algorithm visualizer
    var radioBut = document.querySelectorAll(
      'input[type=radio][name="Insert"]'
    );
    radioBut.forEach((element) => {
      element.addEventListener("change", checkRadio);
    });
    
    // document.getElementById("radio_container").style.display = 'none';


    //frame slidder for forming new array sorting
    let frameSlider = document.getElementById("frameSlider");
    frameSlider.oninput = function () {
      Utils.AnimationController.frameRate = frameSlider.value;
      Utils.AnimationController.recentFrameRate = frameSlider.value;
    };

    makeReady(1, [mousedown,mouseup]);

    slider.oninput = function () {
      Utils.Sorting.newarray(slider.value);
      if (Utils.AnimationController.playing) {
        Utils.AnimationController.playing = false;
      }
      drawBars("red");
    };

    //on click abot button pop introduction 
    document.getElementById('introduce').addEventListener('click',()=>{
      introduce.style.display = 'grid';
    }
    );
    document.getElementById('close-btn').addEventListener("click",()=>{
      introduce.style.display = "none";
    });
    introduction.innerHTML = HTML[0];
    introduce.style.display = "none";
  }
}) (window, document, undefined);
