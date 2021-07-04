import {Utils, main, makeReady, sort, obtainMousePosition} from "./canvas.js";
var toggler = "bubblesort";
const drawmode = [0x001, 0x002, 0x004, 0x008]; //lookuptable [newstart, newend, removemode, insertmode]
var mousedownID = -1;

//Add active class to Selected links
const changeActive = (_tog)=>{
    document.getElementById(toggler).classList.toggle("active");
    toggler = _tog;
    document.getElementById(toggler).classList.toggle("active");
}



//switch radio buttons
function checkRadio(event) {
    Utils.Drawmodes = drawmode[this.value-1];

}

function mousedown(event) {
    obtainMousePosition(event);
    if (mousedownID == -1) {  //Prevent multiple loops!
        mousedownID = setInterval(
            () => {
                let element = document.getElementById("CANVAS");
                element.onmousemove = obtainMousePosition;
                //    element.onmousedown=obtainMousePosition;
            },
            100); /*execute every 100ms*/
    }
}

function mouseup(event) {
    if (mousedownID != -1) {  //Only stop if exists
        clearInterval(mousedownID);
        let element = document.getElementById("CANVAS");
        element.onmousemove = null;
        mousedownID = -1;
    }
}

const BubbleSort = ()=>{ 
    makeReady(1, [mousedown, mouseup]);
    changeActive("bubblesort"); 
    };                                      //function for bubblesort

const HeapSort = ()=>{ 
    makeReady(1, [mousedown, mouseup]);
    changeActive("heapsort");
    };                                      //function for Heapsort

const QuickSort = ()=>{ 
    makeReady(1, [mousedown, mouseup]);
    changeActive("quicksort")               //function for quicksort
    }; 
const MergeSort = ()=>{ 
    makeReady(1, [mousedown, mouseup]);
    changeActive("mergesort");
    };                                      //function for MergeSort

const PathFind = ()=>{ 
    makeReady(2, [mousedown, mouseup]);
    changeActive("pathfind");
    };                                      //function for Path Finding Algorithm

const Linkedlist = ()=>{
    changeActive("linkedlist");
};                                          //function for Linked List

const Bst = ()=>{
    changeActive("bst");                    //function for Bst
}

function Sortingmethod() {
    if (toggler) {
        if (toggler === "pathfind" || toggler === "bst" || toggler === "linkedlist") {
            sort(toggler);
            return;
        }
    
        if (Utils.Sorting.arr.length == 0) {
            alert("Slide on the slider");
        } else {
            sort(toggler, Utils.Sorting.arr);
        }
    } else {
        alert("Select A Method First");
    }
}

(function (window, document, undefined) {

    // code that should be taken care of right away
    window.onload = init;

    function init() {
        // the code to be called when the dom has loaded
        // #document has its nodes
        document.getElementById("bubblesort").addEventListener("click", BubbleSort, false);
        document.getElementById("quicksort").addEventListener("click", QuickSort, false);
        document.getElementById("heapsort").addEventListener("click", HeapSort, false);
        document.getElementById("mergesort").addEventListener("click", MergeSort, false);
        document.getElementById("pathfind").addEventListener("click", PathFind, false);
        document.getElementById("bst").addEventListener("click", Bst, false);
        document.getElementById("linkedlist").addEventListener("click", Linkedlist, false);


        document.getElementById("insert").addEventListener("click", checkRadio);
        document.getElementById("deleteNode").addEventListener("click", checkRadio);
        document.getElementById("insertEnd").addEventListener("click", checkRadio);
        document.getElementById("insertStart").addEventListener("click", checkRadio);

        document.getElementById("playPause").addEventListener("click", ()=>{
            var playPause = document.getElementById("playPause");
            if(!Utils.AnimationController.playing){
                Utils.AnimationController.cancelAnimation();
                Utils.AnimationController.playing = true;
                Utils.AnimationController.frameRate = Utils.AnimationController.recentFrameRate;
                playPause.classList.toggle("paused");
                Sortingmethod();
            }
            if (playPause.classList.length == 1){
                Utils.AnimationController.recentFrameRate = Utils.AnimationController.frameRate;
                Utils.AnimationController.frameRate = 100000;
                playPause.classList.toggle("paused");
            }else{
                Utils.AnimationController.frameRate = Utils.AnimationController.recentFrameRate;
                playPause.classList.toggle("paused");
            }
        });
        var radioBut = document.querySelectorAll('input[type=radio][name="Insert"]');
        radioBut.forEach(element => 
            {
                element.addEventListener("change",checkRadio);
            }
        );
        radioBut.forEach(element=>
            {
                element.disabled = true;
            });
        
        document.getElementById('canvas').style.visibility = "hidden";
        let slider = document.getElementById("myRange");

        slider.oninput = function () {
            Utils.Sorting.newarray(slider.value);
            main(Utils.Sorting.arr);
        }
    }

})(window, document, undefined);